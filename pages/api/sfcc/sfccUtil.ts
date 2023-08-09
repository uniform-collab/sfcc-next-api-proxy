import { Checkout, ClientConfig } from "commerce-sdk";
import { ShopperBaskets } from "commerce-sdk/dist/checkout/checkout";

const getClientConfig = async (): Promise<ClientConfig> => {
  const CLIENT_ID = process.env.SFCC_CLIENT_ID;
  const ORG_ID = process.env.SFCC_ORG_ID;
  const SHORT_CODE = process.env.SFCC_SHORT_CODE;
  const SITE_ID = process.env.SFCC_SITE_ID;
  const clientConfig: ClientConfig = {
    headers: {},
    parameters: {
      clientId: CLIENT_ID,
      organizationId: ORG_ID,
      shortCode: SHORT_CODE,
      siteId: SITE_ID,
    },
  };
  return clientConfig;
};

async function getShopperToken() {
  const credentials = `${process.env.SFCC_CLIENT_ID}:${process.env.SFCC_CLIENT_SECRET}`;
  const base64data = Buffer.from(credentials).toString("base64");
  const headers = {
    Authorization: `Basic ${base64data}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
  let formBody: any = [];
  let encodedKey = encodeURIComponent("grant_type");
  let encodedValue = encodeURIComponent("client_credentials");
  formBody.push(encodedKey + "=" + encodedValue);

  encodedKey = encodeURIComponent("client_id");
  encodedValue = encodeURIComponent(process.env.SFCC_CLIENT_ID!);
  formBody.push(encodedKey + "=" + encodedValue);

  encodedKey = encodeURIComponent("channel_id");
  encodedValue = encodeURIComponent(process.env.SFCC_SITE_ID!);
  formBody.push(encodedKey + "=" + encodedValue);

  formBody = formBody.join("&");

  const endpoint = `https://${process.env.SFCC_SHORT_CODE}.api.commercecloud.salesforce.com/shopper/auth/v1/organizations/${process.env.SFCC_ORG_ID}/oauth2/token`;

  const response = await fetch(endpoint, {
    headers,
    body: formBody,
    method: "POST",
  });

  if (!response.ok) {
    console.error("Unable to generate auth token");
    return undefined;
  }
  const data = await response.json();
  return data?.access_token;
}

export async function addItemToBasket(
  basketId: string,
  items: Array<ShopperBaskets.ProductItem>,
  authToken: string
) {
  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };
  const endpoint = `https://${process.env.SFCC_SHORT_CODE}.api.commercecloud.salesforce.com/checkout/shopper-baskets/v1/organizations/${process.env.SFCC_ORG_ID}/baskets/${basketId}/items?siteId=${process.env.SFCC_SITE_ID}`;

  const response = await fetch(endpoint, {
    headers,
    body: JSON.stringify(items),
    method: "POST",
  });

  if (!response.ok) {
    console.error("Unable to add item to cart", {
      status: response.status,
      message: response.statusText,
    });
    return undefined;
  }
  return await response.json();
}

export async function deleteBasket(basketId: string, token: string) {
  const clientConfig = await getClientConfig();
  const shopperBasketsClient = new Checkout.ShopperBaskets(clientConfig);
  const createBasketResponse = shopperBasketsClient.deleteBasket({
    parameters: {
      basketId,
    },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await createBasketResponse;
}

export async function createEmptyBasket() {
  const clientConfig = await getClientConfig();
  const shopperBasketsClient = new Checkout.ShopperBaskets(clientConfig);
  const token = await getShopperToken();
  const createBasketResponse = shopperBasketsClient.createBasket({
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: {},
  });

  const basketData = await createBasketResponse;
  return {
    basket: basketData,
    access_token: token,
  };
}

export async function getBasket(basketId: string, token: string) {
  const clientConfig = await getClientConfig();
  const shopperBasketsClient = new Checkout.ShopperBaskets(clientConfig);
  try {
    const resp = shopperBasketsClient.getBasket({
      parameters: {
        basketId: basketId,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return resp;
  } catch (error) {
    console.log({ error });
  }
}
