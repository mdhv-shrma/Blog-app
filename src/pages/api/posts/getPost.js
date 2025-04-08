import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const posts = await Post.find({});
      res.status(200).json(posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      res.status(500).json({ message: "Error fetching posts" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
