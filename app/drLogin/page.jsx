"use client"
import React, { useState } from "react";
import LoginLogos from "../../components/LoginLogos"
import LoginImage from '../../components/LoginImage'
import getData from "../Data/getData";
import { useRouter } from "next/navigation";

export default function DrLogin() {
  const [drId, setDrId] = useState();
  const [hastaneAdi, setHastaneAdi] = useState();
  const router = useRouter();

  const handleLogin = async () => {
    const doctors = await getData("DOCTOR");
    const hospitals = await getData("HOSPİTAL");

    const hospital = hospitals.find(h => h.hastaneAdi == hastaneAdi);
    if (hospital) {
      const control = doctors.find(d => d.doktorID == drId && d.hastaneID == hospital.hastaneID);
      if (control) {
        router.push("/drDash");
      } else {
        alert('Hatalı drID veya hastaneAdi');
      }
    } else {
      alert('Hatalı drID veya hastaneAdi');
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
            placeholder="Doctor Id"
            onChange={(e) => setDrId(e.target.value)}
          />
          <br />
          <input
            className="w-1/2 h-7 border border-black border-opacity-65 pl-1 rounded-md "
            type="password"
            placeholder="hastaneAdi"
            onChange={(e) => setHastaneAdi(e.target.value)}
          />
          <br />
          <button className="w-1/2 h-8 bg-teal-500 hover:bg-teal-600 w-1/2 h-7 
            border border-black border-opacity-65 text-white px-3 rounded-md"
            onClick={handleLogin}>Giriş Yap
          </button>
        </div>

      </header>
      <LoginImage />
    </main>
  );
}
