/* eslint-disable no-console */
/* eslint-disable radix */
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { addItemToBasket } from "../sfccUtil";
import { ShopperBaskets } from "commerce-sdk/dist/checkout/checkout";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { productId, quantity } = req.query || {};

  if (!productId) {
    return res.status(400).json({ message: "basket id is required" });
  }
  if (!quantity) {
    return res.status(400).json({ message: "basket id is required" });
  }

  const cookies = cookie.parse(req.headers.cookie!);
  const authToken = cookies["auth_token"];
  if (!authToken) {
    return res.status(401).json({ message: "auth token is not set" });
  }

  const basketId = cookies["basketId"];
  if (!basketId) {
    return res.status(401).json({ message: "basketId is not set" });
  }

  const products: Array<ShopperBaskets.ProductItem> = [
    {
      productId: productId as string,
      quantity: parseInt(quantity as string),
    },
  ];

  const basket = await addItemToBasket(basketId as string, products, authToken);
  return res.status(200).json({
    basket: basket,
  });
};
