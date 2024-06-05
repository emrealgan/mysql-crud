"use client"
import React, { useState, useEffect } from 'react';
import { Hospital } from '@/app/lib/models';
import toast, { Toaster } from 'react-hot-toast';

export default function HospitalList() {

  const [newHospital, setNewHospital] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [editHastaneID, setEditHastaneID] = useState(null);
  const [isSuccess, setIsSuccess] = useState();
  const [refresh, setRefresh] = useState(0)

  useEffect(() => {
    async function fetchHospital() {
      try {
        const response = await fetch('http://localhost:3000/api/getData/Hospital', {method: 'GET'});
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
    function messageToast(){
      if(isSuccess)
      {
        toast.success('İşlem başarıyla tamamlandı ', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
      else if(isSuccess == false){
        toast.error('İşlem sırasında bir hata oluştu ', {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          });
      }
    }
    messageToast() 
    fetchHospital();
  }, [refresh]);


  function addRefresh() {
    setRefresh(refresh + 1)
  }
  const handleHospitalSubmit = async (e) => {
    e.preventDefault();
    try {

      await addNewHospitalToDatabase();
      setNewHospital("");
    }
    catch (error) {
      console.error('Hastane eklenirken hata oluştu:', error);
    }
    e.target.reset();
  }
  
  async function addNewHospitalToDatabase() {
    try {
      const newHospitalObj = new Hospital(
        newHospital
      );
      const sql = `INSERT INTO Hospital 
        (hastaneAdi) VALUES(?)`;
      const values = [newHospitalObj.hastaneAdi];
      const response = await fetch('/api/addData/Hospital', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql, values })
      });

      const result = await response.json();
      if (response.ok) {
        console.log('User added successfully:', result);
        setIsSuccess(true);
        addRefresh();
      }
      else {
        console.error('Error adding user:', result);
        setIsSuccess(false)
      }
    }
    catch (error) {
      console.error('Request error:', error);
      setIsSuccess(false)
    }
  }
  async function updateHospitalInDatabase() {
    try {
      const sql = `UPDATE Hospital SET 
        hastaneAdi = ? 
        WHERE hastaneID = ?`;

      const values = [
        newHospital,
        editHastaneID
      ]
      const response = await fetch('/api/updateData/Hospital', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql, values }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('User added successfully:', result);
        setEditHastaneID(null)
        setIsSuccess(true);
        addRefresh()
        setNewHospital("")
      }
      else {
        console.error('Error adding user:', result);
        setIsSuccess(false)
      }
    }
    catch (error) {
      console.error('Request error:', error);
      setIsSuccess(false)
    }
  }
  async function deleteHospitalFromDatabase(deleteID) {
    try {
      const response = await fetch('/api/deleteData/Hospital', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nameID: "hastaneID", ID: deleteID })
      });

      const result = await response.json();
      if (response.ok) {
        console.log('User deleted successfully:', result);
        setIsSuccess(true);
        addRefresh();
      }
      else {
        console.error('Error deleting user:', result);
        setIsSuccess(false)
      }
    }
    catch (error) {
      console.error('Request error:', error);
      setIsSuccess(false)
    }
  }

  return (
    <>
      <Toaster/>
      <h2 className="text-2xl font-bold mb-4">Hastaneler</h2>
      <ul className="bg-gray-100 p-4 rounded-lg">
        {hospitals.map(hospital => (
          <li key={hospital.hastaneID} className="mb-2 flex justify-between items-center">
            {editHastaneID === hospital.hastaneID ? (
              <div>
                <input
                  type="text"
                  defaultValue={hospital.hastaneAdi}
                  placeholder="Hastane adı giriniz"
                  className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
                  onChange={(e) => setNewHospital(e.target.value.trim())}
                />
                <button
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => updateHospitalInDatabase()}>Güncelle
                </button>
                <button
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setEditHastaneID(null)}>İptal
                </button>
              </div>
            ) : (
              <span className="text-lg font-semibold">{hospital.hastaneID} {hospital.hastaneAdi}</span>
            )}

            <div>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setEditHastaneID(hospital.hastaneID)}>Düzenle
              </button>
              <button
                className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => deleteHospitalFromDatabase(hospital.hastaneID)}>Sil</button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">Yeni Hastane Ekle</h2>
      <form onSubmit={(e) => handleHospitalSubmit(e)} className="mb-8">

        <input
          type="text"
          placeholder="Hastane adı giriniz"
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewHospital(e.target.value.trim())}
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Ekle</button>
      </form>
    </>
  )
}

