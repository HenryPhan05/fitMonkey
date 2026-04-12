"use client";

import { useState, useEffect } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../_utils/firebase";
import { supabase } from "@/app/utils/supabase";

interface InputPostProps {
  user: any;
}

export default function InputPost({ user }: InputPostProps) {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [postContent, setPostContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data: userData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userData) setUserProfile(userData);
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (postContent.trim() === "" || !userProfile) return;

    setLoading(true);

    try {
      await addDoc(collection(db, "posts"), {
        userId: userProfile.id,
        displayName: `${userProfile.first_name} ${userProfile.last_name}`,
        avatar_url: userProfile.avatar_url || "/images/default-avatar.jpg",
        content: postContent,
        imageUrl: "", // Sending empty string so PostCard hides the workout section
        likes: [],
        timestamp: serverTimestamp(), 
      });

      setPostContent("");
    } catch (err) {
      console.error("Error adding post: ", err);
    } finally {
      setLoading(false);
    }
  };

  if (!userProfile) return null;

  return (
    <form onSubmit={handleSubmit} className="bg-yellow-400 mb-4 rounded-2xl p-4 mt-10">
      <div className="flex items-center">
        <img
          src={userProfile.avatar_url || "/images/default-avatar.jpg"}
          className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-yellow-600"
          alt="Profile"
        />
        <input
          className="flex-1 bg-yellow-500 text-black placeholder-black p-4 rounded-xl font-medium outline-none focus:ring-2 focus:ring-yellow-600"
          placeholder={`${userProfile.first_name}, share your fitness journey!`}
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-zinc-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition ml-4 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "..." : "Post"}
        </button>
      </div>
    </form>
  );
}