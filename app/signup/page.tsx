'use client';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/navigation';
export default function SignUp() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setErrorMsg("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      return;
    }
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: `${firstName} ${lastName}`,
        }
      }
    });
    if (signUpError) {
      setErrorMsg(signUpError.message);
      return;
    }
    if (!signUpData.user) {
      setErrorMsg('sign Up failed');
      return;
    }


    const { error: dbError } = await supabase
      .from("users")
      .insert({
        id: signUpData.user.id,
        email: email,
        first_name: firstName,
        last_name: lastName
      });
    if (dbError) {
      setErrorMsg(dbError.message);
      return;
    }
    router.push("/homepage");
  }

  const router = useRouter();
  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="flex-1 flex items-center justify-center p-12 relative">
        <Image
          src="/images/shapes/background.png"
          alt="Background Gradient"
          fill
          className="object-cover object-center"
        />
        <div className="text-center">
          <Image
            src="/images/branding/fitMONKEYStacked.png"
            alt="fitMONKEY"
            width={320}
            height={280}
            className="mx-auto drop-shadow-xl"
            priority
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-500 font-medium mb-8"
          >
            ← Landing Page
          </Link>
          <div className="text-center mb-8 mt-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-1">Create your account</h1>
          </div>
          <form className="space-y-5" onSubmit={handleSignUp}>
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-4 py-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900"
              />
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address..."
              className="w-full px-4 py-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900"
              />
              <button
                type="button"

                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full px-4 py-4 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 text-gray-900"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errorMsg && (
              <p className='text-red-500 text-sm'>{errorMsg}</p>
            )}
            <button
              type="submit"
              className="w-full bg-yellow-400 hover:bg-yellow-300 transition-colors text-black font-semibold py-4 rounded-2xl text-lg mt-6 hover:cursor-pointer"
            >
              Create account
            </button>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/signin"
              className="inline-flex items-center gap-1 text-amber-400 hover:underline font-medium"
            >
              Already have an account? <span className="font-semibold">Sign In</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}