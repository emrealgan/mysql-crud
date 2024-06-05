"use client"
import Image from "next/image";
import cityImg from "../public/cityHosp.png" 
import React from 'react'

export default function LoginImage() {
  return (
        
    <div style={{ width: "50%", height: "50rem", marginTop: "1.5rem" }} >
      <Image className="w-full h-full" src={cityImg}></Image>
    </div>
  );
}
  
