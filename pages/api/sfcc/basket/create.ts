/* eslint-disable no-console */
/* eslint-disable radix */
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { createEmptyBasket } from "../sfccUtil";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const basketData = await createEmptyBasket();
  const basketId = basketData.basket.basketId;
  if (!basketId) {
    return res.status(400).json({ message: "failed to create basket" });
  }

  res.setHeader("Set-Cookie", [
    serialize("auth_token", basketData.access_token, {
      httpOnly: true,
      path: "/",
    }),
    serialize("basketId", basketId, {
      httpOnly: true,
      path: "/",
    }),
  ]);

  return res.status(200).json({ basketId });
};
