"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../_utils/firebase";

export default function InputPost({ user }: { user: any }) {
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="bg-yellow-400 p-4 rounded-2xl m-7">
        Loading post box...
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (postContent.trim() === "") return;

    setLoading(true);

    try {
      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        content: postContent,
        timestamp: new Date(),
      });

      setPostContent("");
    } catch (err) {
      console.error("Error adding post: ", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-yellow-400 mb-4 rounded-2xl p-4 mt-10 ml-7 mr-7"
    >
      <div className="flex items-center">
        <img
          src={user?.photoURL || "https://via.placeholder.com/150"}
          alt={user?.displayName || "User"}
          className="w-10 h-10 rounded-full object-cover mr-3"
        />

        <input
          className="w-100 bg-yellow-500 text-black placeholder-black p-4 rounded-xl font-medium shadow-md"
          placeholder={`${user?.displayName || "User"} share your fitness journey!`}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />

        <button
          type="submit"
          className="mt-2 bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 ml-5"
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}