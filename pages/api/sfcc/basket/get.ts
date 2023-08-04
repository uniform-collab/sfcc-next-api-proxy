/* eslint-disable no-console */
/* eslint-disable radix */
import { NextApiRequest, NextApiResponse } from "next";
import { getBasket } from "../sfccUtil";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { basketId } = req.query;
  if (!basketId) {
    return res.status(400).json({ message: "basket id is required" });
  }

  const basketResponse = await getBasket(basketId as string);

  return res.status(200).json({
    data: basketResponse,
  });
};
