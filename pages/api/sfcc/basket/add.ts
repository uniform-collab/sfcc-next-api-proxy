/* eslint-disable no-console */
/* eslint-disable radix */
import { NextApiRequest, NextApiResponse } from "next";
import { addItemToBasket } from "../sfccUtil";
import { ShopperBaskets } from "commerce-sdk/dist/checkout/checkout";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { basketId, productId, quantity } = req.query || {};
  if (!basketId) {
    return res.status(400).json({ message: "basket id is required" });
  }
  if (!productId) {
    return res.status(400).json({ message: "basket id is required" });
  }
  if (!quantity) {
    return res.status(400).json({ message: "basket id is required" });
  }

  const products: Array<ShopperBaskets.ProductItem> = [
    {
      productId: productId as string,
      quantity: parseInt(quantity as string),
    },
  ];
  console.log({ products });

  const basket = await addItemToBasket(basketId as string, products);
  return res.status(200).json({
    basket: basket,
  });
};
