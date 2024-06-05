"use client"
import React, { useEffect, useState } from "react";
import LoginLogos from "../../components/LoginLogos"
import LoginImage from "../../components/LoginImage"
import { useRouter } from "next/navigation";

export default function CitizenLogin() {
  const [citizenID, setCitizenID] = useState();
  const [phone, setPhone] = useState();
  const [citizens, setCitizens] = useState();
  const router = useRouter();

  useEffect(() => {
    async function fetchPatient() {
      try {
        const response = await fetch('http://localhost:3000/api/getData/Patient', { method: 'GET' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCitizens(data.rows)
      }
      catch (error) {
        console.error('Error fetching data:', error);
        setCitizens([])
      }
    }
    fetchPatient();
  }, [])

  const handleLogin = async () => {

    
    const control = citizens.find(c => c.hastaID == citizenID && c.telefon == phone);
    if (control) {
      router.push("/citizenDash");
    }
    else {
      alert('Hatalı ID no veya telefon numarası');
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
            placeholder="Hasta ID"
            onChange={e => setCitizenID(e.target.value)}
          />
          <br />
          <input
            className="w-1/2 h-7 border border-black border-opacity-65 pl-1 rounded-md "
            type="password"
            placeholder="Phone"
            onChange={e => setPhone(e.target.value)}
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
