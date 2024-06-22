"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoginLogos from "@/components/LoginLogos";
import LoginImage from "@/components/LoginImage";
import { signIn } from "next-auth/react";

export default function Login({role}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
   
    const result = await signIn('credentials', {
      username: username,
      password: password,
      role: role,
      redirect: false,
    });

    if (result.error) {
      alert("Hatalı")
    }
    else if(result.ok){
      if(role == "administrator")
        role = "admin"
      router.push(`/${role}`);
    }
  };

  return (
    <main className="w-full h-full flex flex-row bg-gray-50">
      <header className="w-1/2 h-40 pt-8">
        <LoginLogos />
        <div id="inputs" className="h-1/3 mt-40 flex flex-col items-center">
          <input
            className="w-1/2 h-7 border border-black border-opacity-65 pl-1 rounded-md"
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
          <br />
          <input
            className="w-1/2 h-7 border border-black border-opacity-65 pl-1 rounded-md"
            type="password"
            placeholder="Parola"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <br />
          <button
            className="w-1/2 h-8 bg-teal-500 hover:bg-teal-600 border border-black border-opacity-65 text-white px-3 rounded-md"
            onClick={handleLogin}
          >
            Giriş Yap
          </button>
        </div>
      </header>
      <LoginImage />
    </main>
  );
}
