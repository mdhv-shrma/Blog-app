export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Here, you can handle the form submission, e.g., send an email or save to a database.
    console.log("Contact form submitted:", { name, email, message });

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error handling contact form submission:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
