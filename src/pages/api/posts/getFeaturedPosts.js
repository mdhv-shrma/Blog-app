import dbConnect from "@/lib/db";
import Post from "@/models/Post";

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === "GET") {
      const posts = await Post.find({ isFeatured: true }).sort({ createdAt: -1 }); // Query only featured posts
      res.status(200).json(posts);
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Failed to fetch featured posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
