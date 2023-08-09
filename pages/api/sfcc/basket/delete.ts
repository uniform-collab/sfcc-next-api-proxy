/* eslint-disable no-console */
/* eslint-disable radix */
import cookie from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { deleteBasket } from "../sfccUtil";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = cookie.parse(req.headers.cookie!);

  const basketId = cookies["basketId"];
  if (!basketId) {
    return res.status(401).json({ message: "basketId is not set" });
  }

  const authToken = cookies["auth_token"];
  if (!authToken) {
    return res.status(401).json({ message: "auth token is not set" });
  }

  const basket = await deleteBasket(basketId as string, authToken);
  return res.status(200).json({
    basket: basket,
  });
};
