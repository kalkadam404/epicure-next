'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { Login } from "@/components/Login";
import { Register } from "@/components/Register";

export default function LoginPage() {
  const { user, loading } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    // If user is already authenticated, redirect to profile
    if (!loading && user) {
      router.push('/profile');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center">
      <Login
        isOpen={!showRegister}
        onClose={() => router.push('/')}
        onSwitchToRegister={() => setShowRegister(true)}
      />
      <Register
        isOpen={showRegister}
        onClose={() => router.push('/')}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    </div>
  );
}



