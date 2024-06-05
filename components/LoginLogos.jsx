"use client"
import Image from "next/image";
import logoGov from "../public/logo1.png" 
import logoHos from "../public/logo2.png" 
import React from 'react'

export default function LoginImage() {
  return (
        
    <div id="icons" className="flex flex-row">
      <Image className="ml-10 py-2 w-28 h-28" src={logoGov} />
      <Image className="ml-28 py-5 mb-2 w-64 h-28" src={logoHos} />
    </div>  
  );
}
