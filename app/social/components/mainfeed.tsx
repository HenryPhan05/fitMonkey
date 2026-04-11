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
        // 1. Create the query
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));

        // 2. Set up the real-time listener (onSnapshot)
        // We don't need a separate async function for onSnapshot
        const unsubscribe = onSnapshot(q, 
            (snapshot) => {
                const postsData = snapshot.docs.map(doc => ({ 
                    id: doc.id, 
                    ...doc.data() 
                }));
                setPosts(postsData);
                setLoading(false);
            }, 
            (err) => {
                console.error("Firestore error:", err);
                setError("Failed to load posts.");
                setLoading(false);
            }
        );

        // 3. Return the unsubscribe function directly to React
        return () => unsubscribe();
    }, []); // Runs once on mount

    return (
        <div className="flex flex-col w-full max-w-2xl mx-auto">
            {loading && <p className="text-zinc-400">Loading feed...</p>}
            {error && <p className="text-red-500">{error}</p>}  
            {!loading && posts.length === 0 && <p className="text-zinc-500 text-center py-10">No posts yet!</p> }     
            
            <div className="space-y-4">
                {posts.map(post => (
                    <PostCard key={post.id} post={post} user={user} />
                ))}
            </div>
        </div>
    );
}
