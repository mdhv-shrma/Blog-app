import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  // Use getToken to validate the session
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { title, slug, content, image, isFeatured } = req.body;

  try {
    const user = await User.findOne({ name: token.name });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newPost = new Post({
      title,
      slug,
      content,
      image,
      isFeatured,
      author: user._id, // Use ObjectId
    });
    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
