import Link from "next/link";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("Failed to send message.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h2 className="text-3xl font-bold mb-6 text-blue-600 dark:text-blue-400">
        Contact Us
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        />
        <input
          name="email"
          type="email"
          placeholder="Your Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
        />
        <textarea
          name="message"
          placeholder="Your Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          className="w-full p-3 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
          rows="5"
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Send Message
        </button>
      </form>
      {status && <p className="mt-4 text-center text-gray-700 dark:text-gray-300">{status}</p>}
      <div className="mt-6 text-center">
        <Link
          href="/signup"
          className="text-blue-600 hover:underline dark:text-blue-400"
        >
          Dont have an account? Sign Up
        </Link>
      </div>
    </div>
  );
}
