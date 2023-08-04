import { Customer, slasHelpers, Checkout, ClientConfig } from "commerce-sdk";
import { ShopperBaskets } from "commerce-sdk/dist/checkout/checkout";

const clientConfig = (): ClientConfig => {
  const CLIENT_ID = process.env.SFCC_CLIENT_ID;
  const ORG_ID = process.env.SFCC_ORG_ID;
  const SHORT_CODE = process.env.SFCC_SHORT_CODE;
  const SITE_ID = process.env.SFCC_SITE_ID;
  const clientConfig: ClientConfig = {
    parameters: {
      clientId: CLIENT_ID,
      organizationId: ORG_ID,
      shortCode: SHORT_CODE,
      siteId: SITE_ID,
    },
  };
  return clientConfig;
};

const getClientConfig = async (): Promise<ClientConfig> => {
  const bearerToken = await getBearerToken();
  const CLIENT_ID = process.env.SFCC_CLIENT_ID;
  const ORG_ID = process.env.SFCC_ORG_ID;
  const SHORT_CODE = process.env.SFCC_SHORT_CODE;
  const SITE_ID = process.env.SFCC_SITE_ID;
  const clientConfig: ClientConfig = {
    headers: {
      Authorization: `Bearer ${bearerToken}`,
    },
    parameters: {
      clientId: CLIENT_ID,
      organizationId: ORG_ID,
      shortCode: SHORT_CODE,
      siteId: SITE_ID,
    },
  };
  return clientConfig;
};

export async function getShopperToken() {
  const credentials = `${process.env.SFCC_CLIENT_ID}:${process.env.SFCC_CLIENT_SECRET}`;
  const clientConfig = await getClientConfig();
  const client = new Customer.ShopperLogin(clientConfig);
  const base64data = Buffer.from(credentials).toString("base64");
  const headers = { Authorization: `Basic ${base64data}` };
  return await client.getAccessToken({
    headers,
    body: {
      grant_type: "client_credentials",
    },
  });
}

export async function getBearerToken() {
  const slasClient = new Customer.ShopperLogin(clientConfig());
  const redirectURI = "http://localhost:3000/callback";
  const guestTokenResponse = await slasHelpers.loginGuestUser(slasClient, {
    redirectURI,
  });
  return guestTokenResponse.access_token;
}

export async function addItemToBasket(
  basketId: string,
  items: Array<ShopperBaskets.ProductItem>
) {
  const clientConfig = await getClientConfig();
  const shopperBasketsClient = new Checkout.ShopperBaskets(clientConfig);
  const createBasketResponse = shopperBasketsClient.addItemToBasket({
    parameters: {
      basketId,
    },
    headers: {
      Authorization: `Bearer ${await getBearerToken()}`,
    },
    body: items,
  });

  return (await createBasketResponse).basketId;
}

export async function deleteBasket(basketId: string) {
  const clientConfig = await getClientConfig();
  const shopperBasketsClient = new Checkout.ShopperBaskets(clientConfig);
  const createBasketResponse = shopperBasketsClient.deleteBasket({
    parameters: {
      basketId,
    },
    headers: {
      Authorization: `Bearer ${await getBearerToken()}`,
    },
  });

  return await createBasketResponse;
}

export async function createEmptyBasket() {
  const clientConfig = await getClientConfig();
  const shopperBasketsClient = new Checkout.ShopperBaskets(clientConfig);
  const createBasketResponse = shopperBasketsClient.createBasket({
    headers: {
      Authorization: `Bearer ${await getBearerToken()}`,
    },
    body: {},
  });

  return await createBasketResponse;
}

export async function getBasket(basketId: string) {
  const clientConfig = await getClientConfig();
  const shopperBasketsClient = new Checkout.ShopperBaskets(clientConfig);
  const token = await getBearerToken();
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
