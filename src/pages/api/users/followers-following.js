import dbConnect from "@/lib/db";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { userId } = req.query;

  try {
    const user = await User.findById(userId)
      .populate("followers", "name email")
      .populate("following", "name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      followers: user.followers,
      following: user.following,
    });
  } catch (error) {
    console.error("Error fetching followers and following:", error);
    res.status(500).json({ message: "Server error" });
  }
}
