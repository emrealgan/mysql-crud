"use client"
import React, { useState, useEffect } from 'react';
import { Specialty } from '@/app/lib/models';
import toast, { Toaster } from 'react-hot-toast';

export default function SpecialtyList() {

  const [newSpecialty, setNewSpecialty] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [editUzmanlikID, setEditUzmanlikID] = useState(null);
  const [isSuccess, setIsSuccess] = useState();
  const [refresh, setRefresh] = useState(0)

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
    fetchSpecialty();
  }, [refresh]);

  function addRefresh() {
    setRefresh(refresh + 1)
  }
 
  const handleSpecialtySubmit = async (e) => {
    e.preventDefault();
    try {
      await addNewSpecialtyToDatabase();
      setNewSpecialty("");
    }
    catch (error) {
      console.error('Uzmanlık Alan eklenirken hata oluştu:', error);
    }
    e.target.reset();
  }

  async function addNewSpecialtyToDatabase() {
    try {
      const newSpecialtyObj = new Specialty(
        newSpecialty
      );
      const sql = `INSERT INTO Specialty 
        (uzmanlikAlani) VALUES(?)`;
      const values = [newSpecialtyObj.uzmanlikAlani];
      const response = await fetch('/api/addData/Specialty', {
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

  async function updateSpecialtyInDatabase() {
    try {
      const sql = `UPDATE Specialty SET 
      uzmanlikAlani = ? 
      WHERE uzmanlikID = ?`;

    const values = [
      newSpecialty,
      editUzmanlikID
    ]
    const response = await fetch('/api/updateData/Specialty', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ sql, values }),
    });

    const result = await response.json();
    if (response.ok) {
      console.log('User added successfully:', result);
      setEditUzmanlikID(null)
      setIsSuccess(true);
      addRefresh()
      setNewSpecialty("")
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
  async function deleteSpecialtyFromDatabase(deleteID) {
    try {
      const response = await fetch('/api/deleteData/Specialty', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nameID: "uzmanlikID", ID: deleteID })
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
      <h2 className="text-2xl font-bold mb-4">Uzmanlık Alanları</h2>
      <ul className="bg-gray-100 p-4 rounded-lg">
        {specialties.map(specialty => (
          <li key={specialty.uzmanlikID} className="mb-2 flex justify-between items-center">
            {editUzmanlikID === specialty.uzmanlikID ? (
              <div>
                <input
                  type="text"
                  placeholder="Uzmanlık Alanı giriniz"
                  defaultValue={specialty.uzmanlikAlani}
                  className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
                  onChange={(e) => setNewSpecialty(e.target.value.trim())}
                />
                <button
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => updateSpecialtyInDatabase()}>Güncelle
                </button>
                <button
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setEditUzmanlikID(null)}>İptal
                </button>
              </div>
            ) : (
              <span className="text-lg font-semibold">{specialty.uzmanlikID} {specialty.uzmanlikAlani}</span>
            )}
            <div>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setEditUzmanlikID(specialty.uzmanlikID)}>Düzenle
              </button>
              <button
                className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => deleteSpecialtyFromDatabase(specialty.uzmanlikID)}>Sil</button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">Yeni Uzmanlık Alanı Ekle</h2>
      <form onSubmit={(e) => handleSpecialtySubmit(e)} className="mb-8">

        <input
          type="text"
          placeholder="Uzmanlık Alanı giriniz"
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewSpecialty(e.target.value.trim())}
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Ekle</button>
      </form>
    </>
  )
}