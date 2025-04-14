import dbConnect from "@/lib/db";
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  const { id } = req.query;

  try {
    const user = await User.findById(id).setOptions({ strictPopulate: false }); // Disable strict populate
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Populate followers and following fields
    await user.populate({ path: "followers", model: "User", select: "name email" });
    await user.populate({ path: "following", model: "User", select: "name email" });

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
}
