// pages/api/test.js
import dbConnect from "../../lib/db";

export default async function handler(req, res) {
  await dbConnect();

  res.status(200).json({ message: "MongoDB Connected Successfully!" });
}
