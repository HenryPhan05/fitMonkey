"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/social/_utils/firebase";
import { collection, getDocs, doc, getDoc, query, where, setDoc } from "firebase/firestore";

export default function FriendsSidebar({ user }: { user: any }) {
  const [friends, setFriends] = useState<any[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Load Friends (Your original logic)
  useEffect(() => {
    if (!user?.id) return;
    const loadFriends = async () => {
      try {
        const snapshot = await getDocs(collection(db, "friends", user.id, "list"));
        const friendIds = snapshot.docs.map((doc) => doc.id);
        const profiles = [];
        for (const id of friendIds) {
          const profileSnap = await getDoc(doc(db, "users", id));
          if (profileSnap.exists()) {
            profiles.push({ id, ...profileSnap.data() });
          }
        }
        setFriends(profiles);
      } catch (err) {
        console.error("Error loading friends:", err);
      }
    };
    loadFriends();
  }, [user?.id]);

  // 2. Simple Add by Email Function
  const handleAddFriend = async () => {
    if (!emailInput.trim()) return;
    setLoading(true);
    try {
      const q = query(collection(db, "users"), where("email", "==", emailInput.toLowerCase()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        alert("No athlete found with that email!");
      } else {
        const friendDoc = querySnapshot.docs[0];
        await setDoc(doc(db, "friends", user.id, "list", friendDoc.id), {
          addedAt: new Date()
        });
        alert("Friend added! Refreshing...");
        window.location.reload(); // Quickest way for a student project to update the UI
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setEmailInput("");
    }
  };

  // 3. Simple Invite Link
  const copyInvite = () => {
    navigator.clipboard.writeText(window.location.origin + "/social");
    alert("Link copied! Send it to your friends.");
  };

  if (!user) return <div className="p-4 text-white">Loading...</div>;

  return (
    <div className="w-64 bg-[#1a1a1a] text-white p-4 h-full flex flex-col border-l border-zinc-800">
      <h2 className="text-lg font-bold mb-4">Friends</h2>

      {/* ADD BY EMAIL SECTION */}
      <div className="mb-6 space-y-2">
        <input 
          type="email" 
          placeholder="Friend's email..."
          className="w-full p-2 text-sm bg-zinc-800 rounded border border-zinc-700 outline-none focus:border-yellow-400"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />
        <button 
          onClick={handleAddFriend}
          disabled={loading}
          className="w-full bg-yellow-400 text-black py-1 rounded text-sm font-bold hover:bg-yellow-500 transition"
        >
          {loading ? "Adding..." : "Add Friend"}
        </button>
      </div>

      {/* FRIENDS LIST */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        {friends.map((friend) => (
          <div key={friend.id} className="flex items-center space-x-3">
            <img
              src={friend.photoURL || "/images/default-avatar.jpg"}
              className="w-8 h-8 rounded-full bg-zinc-700"
              alt="friend"
            />
            <span className="text-sm truncate">{friend.displayName || friend.email}</span>
          </div>
        ))}
      </div>

      {/* INVITE LINK BUTTON */}
      <button 
        onClick={copyInvite}
        className="mt-4 text-xs text-zinc-500 hover:text-yellow-400 transition underline underline-offset-4"
      >
        Copy Invite Link
      </button>
    </div>
  );
}