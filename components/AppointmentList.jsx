"use client";
import React, { useState, useEffect } from 'react';
import { Appointment } from '@/app/lib/models';
import toast, { Toaster } from 'react-hot-toast';

export default function AppointmentList() {

  const initialAppointmentState = {
    hastaID: null,
    doktorID: null,
    randevuTarihi: '',
    randevuSaati: ''
  };
  const [newAppointment, setNewAppointment] = useState(initialAppointmentState);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [editAppointmentID, setEditAppointmentID] = useState(null);
  const [isSuccess, setIsSuccess] = useState();
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const response = await fetch('http://localhost:3000/api/getData/Appointment', { method: 'GET' });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAppointments(data.rows)
      }
      catch (error) {
        console.error('Error fetching data:', error);
        setAppointments([])
      }
    }
    async function fetchPatient() {
      try {
        const response = await fetch('http://localhost:3000/api/getData/Patient', { method: 'GET' });
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
    async function fetchDoctor() {
      try {
        const response = await fetch('http://localhost:3000/api/getData/Doctor', { method: 'GET' });
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
    function messageToast() {
      if (isSuccess) {
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
      else if (isSuccess == false) {
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
    fetchPatient();
    fetchAppointment();
  }, [refresh]);

  function addRefresh() {
    setRefresh(refresh + 1);
  }

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    try {
      const newAppointmentObj = new Appointment(
        Number(newAppointment.hastaID),
        Number(newAppointment.doktorID),
        newAppointment.randevuTarihi,
        newAppointment.randevuSaati
      );
      await addNewAppointmentToDatabase(newAppointmentObj);
      setNewAppointment(initialAppointmentState);
    } catch (error) {
      console.error('Randevu eklenirken hata oluştu:', error);
    }
    e.target.reset();
  };

  async function addNewAppointmentToDatabase(newAppointmentObj) {

    try {
      const sql = `INSERT INTO Appointment 
        (hastaID, doktorID, randevuTarihi, randevuSaati) VALUES(?, ?, ?, ?)`;
      const values = [
        newAppointmentObj.hastaID,
        newAppointmentObj.doktorID,
        newAppointmentObj.randevuTarihi,
        newAppointmentObj.randevuSaati
      ]
      const response = await fetch('/api/addData/Appointment', {
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

  async function updateAppointmentInDatabase() {
    try {
      const sql = `UPDATE Appointment SET 
        hastaID = ?, 
        doktorID = ?, 
        randevuTarihi = ?, 
        randevuSaati = ? 
        WHERE randevuID = ?`;

      const values = [
        newAppointment.hastaID,
        newAppointment.doktorID,
        newAppointment.randevuTarihi,
        newAppointment.randevuSaati,
        editAppointmentID
      ]
      const response = await fetch('/api/updateData/Appointment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql, values }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('User added successfully:', result);
        setEditAppointmentID(null)
        setIsSuccess(true);
        addRefresh()
        setNewAppointment(initialAppointmentState)
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

  async function deleteAppointmentFromDatabase(deleteID) {
    try {
      const response = await fetch('/api/deleteData/Appointment', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nameID: "randevuID", ID: deleteID })
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
      <Toaster />
      <h2 className="text-2xl font-bold mb-4">Randevular</h2>
      <ul className="bg-gray-100 p-4 rounded-lg">
        {appointments.map(appointment => (
          <li key={appointment.randevuID} className="mb-2 flex justify-between items-center">
            {editAppointmentID === appointment.randevuID ? (
              <div>
                <select
                  defaultValue={(() => {
                    newAppointment.hastaID = appointment.hastaID;
                    return appointment.hastaID;
                  })()}
                  onChange={(e) => { newAppointment.hastaID = Number(e.target.value) }} >
                  <option value="">Hasta Seçiniz</option>
                  {patients.map(patient => (
                    <option key={patient.hastaID} value={patient.hastaID}>{`${patient.ad} ${patient.soyad}`}</option>
                  ))}
                </select>
                <select
                  defaultValue={(() => {
                    newAppointment.doktorID = appointment.doktorID;
                    return appointment.doktorID;
                  })()}
                  onChange={(e) => { newAppointment.doktorID = Number(e.target.value) }} >
                  <option value="">Doktor Seçiniz</option>
                  {doctors.map(doctor => (
                    <option key={doctor.doktorID} value={doctor.doktorID}>{`${doctor.ad} ${doctor.soyad}`}</option>
                  ))}
                </select>
                <input
                  defaultValue={(() => {
                    const date = new Date(appointment.randevuTarihi);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    newAppointment.randevuTarihi = `${year}-${month}-${day}`;
                    return `${year}-${month}-${day}`;
                  })()}
                  onChange={(e) => { newAppointment.randevuTarihi = e.target.value.trim() }}
                />
                <input
                  defaultValue={(() => {
                    newAppointment.randevuSaati = appointment.randevuSaati;
                    return appointment.randevuSaati.slice(0, 5);
                  })()}
                  onChange={(e) => { newAppointment.randevuSaati = e.target.value.trim() }}
                />

                <button
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => updateAppointmentInDatabase()}
                >Güncelle
                </button>
                <button
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setEditAppointmentID(null)}>İptal
                </button>
              </div>
            ) : (
              <span className="text-lg font-semibold">{appointment.randevuID} {new Date(appointment.randevuTarihi).toLocaleDateString()}</span>
            )}

            <div>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setEditAppointmentID(appointment.randevuID)}>Düzenle
              </button>
              <button
                className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => deleteAppointmentFromDatabase(appointment.randevuID)}>Sil
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">Yeni Randevu Ekle</h2>
      <form onSubmit={(e) => handleAppointmentSubmit(e)} className="mb-8">
        <select
          onChange={(e) => { newAppointment.hastaID = Number(e.target.value) }} >
          <option value="">Hasta Seçiniz</option>
          {patients.map(patient => (
            <option key={patient.hastaID} value={patient.hastaID}>{`${patient.ad} ${patient.soyad}`}</option>
          ))}
        </select>
        <select
          onChange={(e) => { newAppointment.doktorID = Number(e.target.value) }} >
          <option value="">Doktor Seçiniz</option>
          {doctors.map(doctor => (
            <option key={doctor.doktorID} value={doctor.doktorID}>{`${doctor.ad} ${doctor.soyad}`}</option>
          ))}
        </select>
        <input
          type="date"
          placeholder="Randevu Tarihi"
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => { newAppointment.randevuTarihi = e.target.value.trim() }}
        />
        <input
          type="time"
          placeholder="Randevu Saati"
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => { newAppointment.randevuSaati = e.target.value.trim() }}
        />
        <br />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg">Ekle
        </button>
      </form>
    </>
  );
}
