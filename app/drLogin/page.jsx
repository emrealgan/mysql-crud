"use client"
import React, { useState, useEffect } from "react";
import LoginLogos from "../../components/LoginLogos";
import LoginImage from '../../components/LoginImage';
import { useRouter } from "next/navigation";

export default function DrLogin() {
  const [drId, setDrId] = useState("");
  const [hastaneAdi, setHastaneAdi] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchHospital() {
      try {
        const response = await fetch('/api/getData/Hospital', { method: 'GET' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setHospitals(data.rows)
      }
      catch (error) {
        console.error('Error fetching data:', error);
        setHospitals([])
      }
    }
    async function fetchDoctor() {
      try {
        const response = await fetch('/api/getData/Doctor', { method: 'GET' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDoctors(data.rows)
      }
      catch (error) {
        console.error('Error fetching data:', error);
        setDoctors([])
      }
    }
    fetchDoctor()
    fetchHospital()
    },[])

  const handleLogin = async () => {     
      const doctor = doctors.find(d => d.doktorID == drId);
      if (doctor) {
        const control = hospitals.find(h => h.hastaneAdi == hastaneAdi && h.hastaneID == doctor.hastaneID)
        if (control) {
          router.push("/drDash");
        }
        else
          alert('Hatalı drID veya hastaneAdi');
      } 
      else {
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
