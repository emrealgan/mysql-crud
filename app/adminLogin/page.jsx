"use client";
import React, { useState, useEffect } from "react";
import LoginLogos from "../../components/LoginLogos";
import LoginImage from "../../components/LoginImage";
import Cookies from 'js-cookie';
import { SignJWT } from "jose";
import { getJWTSecretKey } from "../lib/auth";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/getData/Administrator', { method: 'GET' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAdmins(data.rows);
      } catch (error) {
        console.error('Error fetching data:', error);
        setAdmins([]);
      }
    };

    fetchAdmins();
  }, []);

  const handleLogin = async () => {
    const control = admins.find(a => a.username === username && a.password === password);
    if (control) {
      const token = await new SignJWT({
        id: control.yoneticiID
      })
      .setProtectedHeader({ alg: 'HS256'})
      .setIssuedAt()
      .setExpirationTime('1m')
      .sign(getJWTSecretKey())
      Cookies.set('adminToken', token);
      console.log(token)
    } 
    else {
      alert('Hatalı kullanıcı adı veya şifre');
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
