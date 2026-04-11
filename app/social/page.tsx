"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/utils/supabase";
import Mainfeed from "./components/mainfeed";
import InputPost from "./components/inputpost";
import FriendsSidebar from "./components/friendssidebar";
import Sidebar from "@/components/sidebar";

export default function SocialPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Prevent "Cannot read property of null" errors in child components
  if (loading) {
    return (
      <div className="flex min-h-screen bg-black text-white items-center justify-center">
        <p className="animate-pulse">Loading feed...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* LEFT SIDEBAR - Fixed height to avoid layout shift */}
      <aside className="w-64 sticky top-0 h-screen border-r border-zinc-800">
        <Sidebar />
      </aside>

      {/* MAIN FEED - Added max-width to keep it looking clean */}
      <main className="flex-1 p-6 space-y-6 max-w-4xl mx-auto">
        <InputPost user={user} />
        <Mainfeed user={user} />
      </main>

      {/* FRIENDS SIDEBAR */}
      <aside className="w-64 sticky top-0 h-screen border-l border-zinc-800 hidden lg:block">
        <FriendsSidebar user={user} />
      </aside>
    </div>
  );
}
