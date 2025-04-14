import dbConnect from "@/lib/db";
import Post from "@/models/Post";

export default async function handler(req, res) {
  try {
    await dbConnect();

    if (req.method === "GET") {
      const { featured } = req.query;

      const filter = featured === "true" ? { isFeatured: { $eq: true } } : {}; // Explicitly query for true
      const posts = await Post.find(filter).populate("author", "name").sort({ createdAt: -1 }); // Populate author name
      if (!posts || posts.length === 0) {
        console.warn("No posts found");
      }
      res.status(200).json(posts);
    } else {
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
