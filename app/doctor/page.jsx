"use client"
import React from 'react';
import { signOut, useSession } from 'next-auth/react';

export default function drDash() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }
if (!session || session.user.role !== "doctor") {
    return <div>You are not authenticated.</div>;
  }

  return (
    <div>
      <button
        className="mt-2 p-2 bg-red-500 text-white"
        onClick={() => signOut()}
      >
        Logout
      </button>
      <h1>Welcome, {session.user.username}!</h1>
      <p>Your role is: {session.user.role}</p>
    </div>
  );
};
