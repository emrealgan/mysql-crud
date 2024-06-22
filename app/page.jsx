"use client"
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { createDatabaseAndTables } from './lib/createDb';
import logoGov from '../public/logo1.png';
import logoHos from '../public/logo2.png';
import home1 from '../public/home1.png';
import home2 from '../public/home2.png';
import home3 from '../public/home3.png';

export default function Home() {

  useEffect(() => {
    createDatabaseAndTables();
  }, []);
  
  const images = [
    home1,
    home2,
    home3
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="w-full h-full bg-gray-50">
      <header className="w-full h-20 flex flex-row justify-between">
        <div id="icons" className="flex flex-row">
          <Image className="ml-2" src={logoGov} width="90" height="90" />
          <Image className="ml-5 py-5 mt-1" src={logoHos} width="150" height="60" />
        </div>

        <div id="buttons" className="flex items-end	justify-start mr-32 pr-20">
          <Link href="/citizenLogin" className="m-4 bg-teal-500 hover:bg-teal-600 text-white py-2 px-4 rounded">Randevu Al</Link>
          <Link href="/drLogin" className="m-4 bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded">Doktor Paneli</Link>
          <Link href="/adminLogin" className="m-4 bg-blue-900 hover:bg-blue-800 text-white py-2 px-4 rounded">Admin Paneli</Link>

        </div>
      </header>
      <div style={{ width: '80rem', height: '40rem' }} className="my-10 ml-24 w-2/3 h-2/3">
        <Image className="p-4 w-full h-full" src={images[currentIndex]} alt={`Slide ${currentIndex + 1}`} />
      </div>
    </main>
  );
}