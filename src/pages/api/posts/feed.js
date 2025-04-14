import dbConnect from "@/lib/db";
import Post from "@/models/Post";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { userId } = req.query;

  try {
    const user = await User.findById(userId).populate("following", "_id");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const followedUserIds = user.following.map((followedUser) => followedUser._id);
    const posts = await Post.find({ author: { $in: followedUserIds } })
      .populate("author", "name")
      .sort({ createdAt: -1 }); // Sort by newest posts first

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error fetching feed posts:", error);
    res.status(500).json({ message: "Server error" });
  }
}
