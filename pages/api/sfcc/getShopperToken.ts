/* eslint-disable no-console */
/* eslint-disable radix */
import { NextApiRequest, NextApiResponse } from "next";
import { getShopperToken } from "./sfccUtil";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const bearerToken = await getShopperToken();
  return res.status(200).json({
    token: bearerToken,
  });
};
