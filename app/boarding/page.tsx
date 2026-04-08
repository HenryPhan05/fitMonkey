'use client'

import { useState } from 'react'
import { supabase } from '@/app/utils/supabase'
import { useRouter } from 'next/navigation'

export default function OnboardingPage() {
  const router = useRouter()

  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const handleSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return
    if (weight === '' || height === '' || age === '') {
      setErrorMsg("Please enter all field");
      return;
    }
    const { error } = await supabase
      .from('users')
      .update({
        weight: Number(weight),
        height: Number(height),
        age: Number(age),
      })
      .eq('id', user.id)

    if (error) {
      console.error(error)
      return
    }

    router.push('/homepage')
  }

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="p-6 bg-gray-900 rounded-xl w-80">
        <h1 className="text-xl mb-4">Complete your profile</h1>

        <input
          required
          type='number'
          placeholder="Weight (kg)"
          className="w-full mb-2 p-2 text-white text-xm"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <input
          required
          type='number'
          placeholder="Height (cm)"
          className="w-full mb-2 p-2 text-white text-sm"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
        />

        <input
          required
          type='number'
          placeholder="Age"
          className="w-full mb-4 p-2 text-white text-sm"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        {errorMsg && (
          <p className='text-xm text-red-500'>{errorMsg}</p>
        )}
        <button
          onClick={handleSubmit}
          className="w-full bg-yellow-400 text-black p-2 rounded font-bold hover:cursor-pointer hover:opacity-70 "
        >
          Save
        </button>
      </div>
    </div>
  )
}