"use client"
import React, { useState, useEffect } from 'react';
import { Doctor } from '@/app/lib/models';
import toast, { Toaster } from 'react-hot-toast';

export default function DoctorList() {

  const initialDoctorState = {
    ad: '',
    soyad: '',
    uzmanlikID: null,
    hastaneID: null
  };
  const [newDoctor, setNewDoctor] = useState(initialDoctorState);
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [editDoctorID, setEditDoctorID] = useState(null);
  const [isSuccess, setIsSuccess] = useState();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchSpecialty() {
      try {
        const response = await fetch('http://localhost:3000/api/getData/Specialty', {method: 'GET'});
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSpecialties(data.rows)
      } 
      catch (error) {
        console.error('Error fetching data:', error);
        setSpecialties([])
      }
    }
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
    async function fetchDoctor() {
      try {
        const response = await fetch('http://localhost:3000/api/getData/Doctor', {method: 'GET'});
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
      console.log(doctors)
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
    fetchDoctor();
    fetchHospital();
    fetchSpecialty();
  }, [refresh]);

  function addRefresh() {
    setRefresh(refresh + 1)
  }
  
  const handleDoctorSubmit = async (e) => {
    e.preventDefault();
    try {
      const newDoctorObj = new Doctor(
        newDoctor.ad,
        newDoctor.soyad,
        Number(newDoctor.uzmanlikID),
        Number(newDoctor.hastaneID)
      );
      await addNewDoctorToDatabase(newDoctorObj);
      setNewDoctor(initialDoctorState);
    }
    catch (error) {
      console.error('Doktor eklenirken hata oluştu:', error);
    }
    e.target.reset();
  };
  
  async function addNewDoctorToDatabase(newDoctorObj) {
    try {
      const sql = `INSERT INTO DOCTOR 
      (ad, soyad, uzmanlikID, hastaneID) VALUES(?, ?, ?, ?)`;
      const values = [
        newDoctorObj.ad,
        newDoctorObj.soyad,
        newDoctorObj.uzmanlikID,
        newDoctorObj.hastaneID
      ];
      const response = await fetch('/api/addData/Doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({sql, values})
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
  
  async function updateDoctorInDatabase() {
    try {
      const sql = `UPDATE Doctor SET 
        ad = ?, 
        soyad = ?, 
        uzmanlikID = ?, 
        hastaneID = ? 
        WHERE doktorID = ?`;

      const values = [
        newDoctor.ad,
        newDoctor.soyad,
        newDoctor.uzmanlikID,
        newDoctor.hastaneID,
        editDoctorID
      ]
      const response = await fetch('/api/updateData/Doctor', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql, values }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('User added successfully:', result);
        setEditDoctorID(null)
        setIsSuccess(true);
        addRefresh()
        setNewDoctor(initialDoctorState)
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
  
  async function deleteDoctorFromDatabase(deleteID) {
    try {
      const response = await fetch('/api/deleteData/Doctor', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nameID: "doktorID", ID: deleteID })
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
      <h2 className="text-2xl font-bold mb-4">Doktorlar</h2>
      <ul className="bg-gray-100 p-4 rounded-lg">
        {doctors.map(doctor => (
          <li key={doctor.doktorID} className="mb-2 flex justify-between items-center">
            {editDoctorID === doctor.doktorID ? (
              <div>
                <input
                  defaultValue={(() => {
                    newDoctor.ad = doctor.ad;
                    return doctor.ad;
                  })()}
                  onChange={(e) => { newDoctor.ad = e.target.value.trim().charAt(0).toUpperCase() + e.target.value.trim().slice(1) }}
                />
                <input
                  defaultValue={(() => {
                    newDoctor.soyad = doctor.soyad;
                    return doctor.soyad;
                  })()}
                  onChange={(e) => { newDoctor.soyad = e.target.value.trim().toUpperCase() }}
                />
                <select
                  defaultValue={(() => {
                    newDoctor.uzmanlikID = doctor.uzmanlikID;
                    return doctor.uzmanlikID;
                  })()}
                  onChange={(e) => { newDoctor.uzmanlikID = Number(e.target.value) }} >
                  <option value="">Uzmanlık Alanı</option>
                  {specialties.map(specialty => (
                    <option key={specialty.uzmanlikID} value={specialty.uzmanlikID}>{specialty.uzmanlikAlani}</option>
                  ))}
                </select>
                <select
                  defaultValue={(() => {
                    newDoctor.hastaneID = doctor.hastaneID;
                    return doctor.hastaneID;
                  })()}
                  onChange={(e) => { newDoctor.hastaneID = Number(e.target.value) }} >
                  <option value="">Çalıştığı Hastane</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.hastaneID} value={hospital.hastaneID}>{hospital.hastaneAdi}</option>
                  ))}
                </select>
                <button
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => updateDoctorInDatabase()}
                >Güncelle
                </button>
                <button
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setEditDoctorID(null)}>İptal
                </button>
              </div>
            ) : (
              <span className="text-lg font-semibold">{doctor.ad} {doctor.soyad}</span>
            )}
  
            <div>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setEditDoctorID(doctor.doktorID)}>Düzenle
              </button>
              <button
                className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => deleteDoctorFromDatabase(doctor.doktorID)}>Sil
              </button>
            </div>
          </li>
        ))}
      </ul>
  
      <h2 className="text-2xl font-bold mt-8 mb-4">Yeni Doktor Ekle</h2>
      <form onSubmit={(e) => handleDoctorSubmit(e)} className="mb-8">
        <input
          type="text"
          placeholder="Ad"
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewDoctor({ ...newDoctor, ad: e.target.value.trim().charAt(0).toUpperCase() + e.target.value.trim().substring(1) })}
        />
        <input
          type="text"
          placeholder="Soyad"
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewDoctor({ ...newDoctor, soyad: e.target.value.trim().toUpperCase() })}
        />
        <br />
        <select
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewDoctor({ ...newDoctor, uzmanlikID: Number(e.target.value) })} >
          <option value="">Uzmanlık Alanı</option>
          {specialties.map(specialty => (
            <option key={specialty.uzmanlikID} value={specialty.uzmanlikID}>{specialty.uzmanlikAlani}</option>
          ))}
        </select>
        <select
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewDoctor({ ...newDoctor, hastaneID: Number(e.target.value) })} >
          <option value="">Çalıştığı Hastane</option>
          {hospitals.map(hospital => (
            <option key={hospital.hastaneID} value={hospital.hastaneID}>{hospital.hastaneAdi}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg">Ekle
        </button>
      </form>
    </>
  )
}
  