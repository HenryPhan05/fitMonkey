"use client";

import { useEffect, useState } from "react";
import { collection, orderBy, query, onSnapshot } from "firebase/firestore";
import { db } from "../_utils/firebase";
import PostCard from "./postcard";

interface MainFeedProps {
  user: any;
}

export default function MainFeed({ user }: MainFeedProps) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 1. Reference and Query
    const postsCollection = collection(db, "posts");
    const q = query(postsCollection, orderBy("timestamp", "desc"));

    // 2. Real-time Listener
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const postsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsData);
        setLoading(false);
      },
      (err) => {
        console.error("Firestore subscription error:", err);
        setError("Failed to sync the fitness feed. Check your Firestore rules.");
        setLoading(false);
      }
    );

    // 3. Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-20">
      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center py-10 space-y-2">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-500 text-sm italic">Syncing global performance...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-500 text-center">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && posts.length === 0 && !error && (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-3xl">
          <p className="text-zinc-500 font-medium">The feed is empty.</p>
          <p className="text-zinc-600 text-sm">Be the first to share your workout summary!</p>
        </div>
      )}

      {/* The Feed List */}
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard 
            key={post.id} 
            post={post} 
            user={user} 
          />
        ))}
      </div>
    </div>
  );
}