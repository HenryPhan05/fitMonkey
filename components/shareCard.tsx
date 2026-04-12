'use client';

import React, { useRef, useState } from 'react';
import * as htmlToImage from 'html-to-image';
import { db, storage } from '@/app/social/_utils/firebase'; 
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Share2, Loader2 } from 'lucide-react';

interface ShareCardProps {
  cardio: any[];
  strength: any[];
  user: any;
}

export default function ShareCard({ cardio, strength, user }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // Calculate Total
  const totalMinutes = cardio.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalCalories = cardio.reduce((acc, curr) => acc + curr.caloriesBurned, 0);

  const handleShare = async () => {
    if (!user) return;
    setLoading(true);

    let finalImageUrl = "";
    
    // text version
    const statsText = `
🔥 WORKOUT SUMMARY: 
⏱️ Time: ${totalMinutes} mins
🏃 Calories Burned: ${totalCalories} kcal
💪 Exercises: cardio + strength ; 
    `.trim(); 

    try {
      //TRY to generate and upload the image
      // if (cardRef.current) {
      //   try {
      //     const dataUrl = await htmlToImage.toPng(cardRef.current, { cacheBust: true });
      //     const storageRef = ref(storage, `shares/${user.id}-${Date.now()}.png`);
      //     await uploadString(storageRef, dataUrl, 'data_url');
      //     finalImageUrl = await getDownloadURL(storageRef);
      //   } catch (imageErr) {
      //     console.warn("Image generation failed, falling back to text-only.", imageErr);
      //     //finalImageUrl stay empty ("")
      //   }
      // }

      // 3. POST to Firestore
      await addDoc(collection(db, "posts"), {
        userId: user.id,
        displayName: user.user_metadata?.full_name || user.email.split('@')[0],
        avatar_url: user.user_metadata?.avatar_url || "/images/default-avatar.jpg",
        content: statsText,
        imageUrl: finalImageUrl, // If image failed""
        likes: [],
        timestamp: serverTimestamp(),
      });

      alert(finalImageUrl ? "Shared with image!" : "Shared stats (text-only)!");
    } catch (err) {
      console.error("Critical Share Error:", err);
      alert("Could not share workout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center bg-zinc-900/50 p-6 rounded-3xl border border-zinc-800 shadow-2xl">
      {/* card */}
      <div 
        ref={cardRef} 
        className="bg-black border-2 border-yellow-400 p-6 rounded-2xl w-64 mb-4"
      >
        <h3 className="text-yellow-400 font-black italic uppercase text-lg mb-4">Daily Report</h3>
        <div className="space-y-2">
          <div className="flex justify-between border-b border-zinc-800 pb-1">
            <span className="text-zinc-500 text-xs uppercase font-bold">Minutes</span>
            <span className="text-white font-bold">{totalMinutes}</span>
          </div>
          <div className="flex justify-between border-b border-zinc-800 pb-1">
            <span className="text-zinc-500 text-xs uppercase font-bold">Calories Burned</span>
            <span className="text-white font-bold">{totalCalories}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500 text-xs uppercase font-bold">Exercises</span>
            <span className="text-white font-bold">{cardio.length + strength.length}</span>
          </div>
        </div>
      </div>

      {/* SHARE BUTTON */}
      <button
        onClick={handleShare}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-yellow-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition active:scale-95 disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={18} /> : <Share2 size={18} />}
        {loading ? "Processing..." : "Share Stats"}
      </button>
    </div>
  );
}