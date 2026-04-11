"use client"; // <--- ADD THIS AT THE VERY TOP

import { useEffect, useState } from "react";
import { db } from "../_utils/firebase";
import { collection, addDoc, orderBy, query, onSnapshot } from "firebase/firestore";

type Post = {
    id: string;
    content: string;
    timestamp: {
        seconds: number;
    };
    imageUrl?: string;
    userId?: string;
};

export default function PostCard({ post, user }: { post: Post; user: any }) {
    const [commentText, setCommentText] = useState("");
    const [comments, setCommentsList] = useState<any[]>([]);
    const [showComments, setShowComments] = useState(false);

    useEffect(() => {
        if (!showComments || !post.id) return;

        const q = query(collection(db, "posts", post.id, "comments"), orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setCommentsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [post.id, showComments]);

    const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // Safety check for user and text
        if (!user || commentText.trim() === "") {
            alert("You must be logged in to comment!");
            return;
        }

        try {
            await addDoc(collection(db, "posts", post.id, "comments"), {
                content: commentText,
                timestamp: new Date(),
                userId: user.uid || user.id // Supabase uses .id, Firebase uses .uid
            });
            setCommentText("");
        } catch (err) {
            console.error("Error adding comment: ", err);
        }
    };

    return (
        <div className="bg-[#1a1a1a] p-4 rounded-lg mb-4 text-white">
            <p className="text-white">{post.content}</p>
            <p className="text-gray-500 text-sm mt-2">
                {post.timestamp?.seconds ? new Date(post.timestamp.seconds * 1000).toLocaleString() : "Just now"}
            </p>
            {post.imageUrl && (
                <img src={post.imageUrl} alt="Post Image" className="mt-4 rounded w-full object-cover" />
            )}
            
            <div className="flex space-x-4 mt-4 text-gray-500">
                <span
                    className="cursor-pointer hover:text-white transition"
                    onClick={() => setShowComments(!showComments)}
                > 
                    {showComments ? "Hide comments" : "Comment"}
                </span>
                <span className="cursor-pointer hover:text-white transition">Share</span>
            </div>  

            {showComments && (
                <div className="mt-4 border-t border-zinc-800 pt-4">
                    <div className="space-y-2 mb-4">
                        {comments.map((c) => (
                            <div key={c.id} className="text-gray-300 text-sm bg-[#2a2a2a] p-2 rounded">
                                {c.content}
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleCommentSubmit} className="flex">
                        <input
                            className="flex-1 bg-[#333] text-white p-2 rounded-l outline-none border border-transparent focus:border-yellow-400"
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="bg-yellow-400 text-black px-4 rounded-r font-semibold hover:bg-yellow-500 transition"
                        >
                            Post
                        </button>
                    </form>
                </div>
            )}
        </div> 
    );
}
