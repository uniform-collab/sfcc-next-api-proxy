/* eslint-disable no-console */
/* eslint-disable radix */
import { NextApiRequest, NextApiResponse } from "next";
import { createEmptyBasket, getBearerToken } from "../sfccUtil";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const basketData = await createEmptyBasket();
  return res.status(200).json(basketData);
};
