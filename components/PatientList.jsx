"use client"
import React, { useState, useEffect } from 'react';
import { Patient } from '@/app/lib/models';
import toast, { Toaster } from 'react-hot-toast';


export default function PatientList() {

  const initialPatientState = {
    ad: '',
    soyad: '',
    dogumTarihi: '',
    cinsiyet: '',
    telefon: '',
    adres: ''
  };
  const [patients, setPatients] = useState([]);
  const [editPatientID, setEditPatientID] = useState(null);
  const [isSuccess, setIsSuccess] = useState();
  const [refresh, setRefresh] = useState(0);
  const [newPatient, setNewPatient] = useState(initialPatientState);

  useEffect(() => {

    async function fetchPatient() {
      try {
        const response = await fetch('http://localhost:3000/api/getData/Patient', {method: 'GET'});
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPatients(data.rows)
      } 
      catch (error) {
        console.error('Error fetching data:', error);
        setPatients([])
      }
    }
    fetchPatient();
    function messageToast(){
      if(isSuccess)
      {
        toast.success('İşlem başarıyla tamamlandı', {
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
        toast.error('İşlem sırasında bir hata oluştu', {
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
  }, [refresh]);

  function addRefresh() {
    setRefresh(refresh + 1)
  }

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    try {
      const newPatientObj = new Patient(
        newPatient.ad,
        newPatient.soyad,
        newPatient.dogumTarihi,
        newPatient.cinsiyet,
        newPatient.telefon,
        newPatient.adres
      );
      addNewPatientToDatabase(newPatientObj);
      setNewPatient(initialPatientState);
    }
    catch (error) {
      console.error('Hasta eklenirken hata oluştu:', error);
    }
    e.target.reset();
  };
  async function addNewPatientToDatabase(newPatientObj) {
    try {
      const sql = `INSERT INTO Patient 
        (ad, soyad, dogumTarihi, cinsiyet, telefon, adres) VALUES(?, ?, ?, ?, ?, ?)`;
      const values = [
        newPatientObj.ad,
        newPatientObj.soyad,
        newPatientObj.dogumTarihi,
        newPatientObj.cinsiyet,
        newPatientObj.telefon,
        newPatientObj.adres
      ];
      const response = await fetch('/api/addData/Patient', {
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
  async function updatePatientInDatabase() {
    try {
      const sql = `UPDATE Patient SET 
        ad = ?, 
        soyad = ?, 
        dogumTarihi = ?, 
        cinsiyet = ?,
        telefon = ?,
        adres = ?
        WHERE hastaID = ?`;

      const values = [
        newPatient.ad,
        newPatient.soyad,
        newPatient.dogumTarihi,
        newPatient.cinsiyet,
        newPatient.telefon,
        newPatient.adres,
        editPatientID
      ]
      const response = await fetch('/api/updateData/Patient', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql, values }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('User added successfully:', result);
        setEditPatientID(null)
        setIsSuccess(true);
        addRefresh()
        setNewPatient(initialPatientState)
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
  async function deletePatientFromDatabase(deleteID) {
    try {
      const response = await fetch('/api/deleteData/Patient', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nameID: "hastaID", ID: deleteID })
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
      <h2 className="text-2xl font-bold mb-4">Hastalar</h2>
      <ul className="bg-gray-100 p-4 rounded-lg">
        {patients.map(patient => (
          <li key={patient.hastaID} className="mb-2 flex justify-between items-center">
            {editPatientID === patient.hastaID ? (
              <div>
                <input
                  defaultValue={(() => {
                    newPatient.ad = patient.ad;
                    return patient.ad;
                  })()}
                  onChange={(e) => { newPatient.ad = e.target.value.trim().charAt(0).toUpperCase() + e.target.value.trim().slice(1) }}
                />
                <input
                  defaultValue={(() => {
                    newPatient.soyad = patient.soyad;
                    return patient.soyad;
                  })()}
                  onChange={(e) => { newPatient.soyad = e.target.value.trim().toUpperCase() }}
                />
                <input
                  defaultValue={(() => {
                    const date = new Date(patient.dogumTarihi);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    newPatient.dogumTarihi = `${year}-${month}-${day}`;
                    return `${year}-${month}-${day}`;
                  })()}
                  onChange={(e) => { newPatient.dogumTarihi = e.target.value.trim() }}
                />
                <select
                  defaultValue={(() => {
                    newPatient.cinsiyet = patient.cinsiyet;
                    return patient.cinsiyet;
                  })()}
                  onChange={(e) => { newPatient.cinsiyet = e.target.value }} >
                  <option value="E">Erkek</option>
                  <option value="K">Kadın</option>
                </select>
                <input
                  defaultValue={(() => {
                    newPatient.telefon = patient.telefon;
                    return patient.telefon;
                  })()}
                  onChange={(e) => { newPatient.telefon = e.target.value.slice(0, 10) }}
                />
                <input
                  defaultValue={(() => {
                    newPatient.adres = patient.adres;
                    return patient.adres;
                  })()}
                  onChange={(e) => { newPatient.adres = e.target.value.trim() }}
                />
                <button
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => updatePatientInDatabase()}
                >Güncelle
                </button>

                <button
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setEditPatientID(null)}>İptal
                </button>
              </div>
            ) : (
              <span className="text-lg font-semibold">{patient.ad} {patient.soyad}</span>
            )}

            <div>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setEditPatientID(patient.hastaID)}>Düzenle
              </button>
              <button
                className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => deletePatientFromDatabase(patient.hastaID)}>Sil
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">Yeni Hasta Ekle</h2>
      <form onSubmit={(e) => handlePatientSubmit(e)} className="mb-8">
        <input
          name='name'
          type="text"
          placeholder="Ad"
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewPatient({ ...newPatient, ad: e.target.value.trim().charAt(0).toUpperCase() + e.target.value.trim().substring(1) })}
        />
        <input
          name='surname'
          type="text"
          placeholder="Soyad"
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewPatient({ ...newPatient, soyad: e.target.value.trim().toUpperCase() })}
        />
        <input name='dateBirth' type="date" placeholder="Doğum Tarihi" className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewPatient({ ...newPatient, dogumTarihi: e.target.value })}
        />
        <br />
        <select
          name='gender'
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewPatient({ ...newPatient, cinsiyet: e.target.value })} >
          <option value="">Cinsiyet Seçin</option>
          <option value="E">Erkek</option>
          <option value="K">Kadın</option>
        </select>
        <input
          name='phone'
          type="text"
          placeholder="Telefon (+90)"
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => {
            setNewPatient({ ...newPatient, telefon: e.target.value.slice(0, 10) });
          }}
        />
        <input
          name='address'
          type="text"
          placeholder="Adres"
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewPatient({ ...newPatient, adres: e.target.value.trim() })}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg">Ekle
        </button>
      </form>
    </>
  )
}