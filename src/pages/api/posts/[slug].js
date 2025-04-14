import connectDB from "@/lib/db";
import Post from "@/models/Post";

export default async function handler(req, res) {
  await connectDB();

  const { slug } = req.query;

  try {
    const post = await Post.findOne({ slug }).populate("author", "name"); // Populate author name

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Server error" });
  }
}
