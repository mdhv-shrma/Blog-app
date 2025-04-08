// pages/api/posts/add.js
import dbConnect from "@/lib/db";
import Post from "@/models/Post";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { title, slug, content, image } = req.body;

  try {
    const newPost = new Post({ title, slug, content, image });
    await newPost.save();
    res.status(201).json({ success: true, post: newPost });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
