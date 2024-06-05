"use client"
import React, { useState, useEffect } from 'react';
import { MedicalReport } from '@/app/lib/models';
import toast,{ Toaster } from 'react-hot-toast';

export default function ReportList() {

  const initialMedicalReportState = {
    hastaID: null,
    doktorID: null,
    raporTarihi: '',
    raporUrl: '',
    raporIcerigi: ''
  };

  const [newMedicalReport, setNewMedicalReport] = useState(initialMedicalReportState)
  const [medicalReports, setMedicalReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [editReportID, setEditReportID] = useState(null);
  const [isSuccess, setIsSuccess] = useState();

  const [refresh, setRefresh] = useState(0)


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
    }
    async function fetchMedicalReport() {
      try {
        const response = await fetch('http://localhost:3000/api/getData/MedicalReport', {method: 'GET'});
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMedicalReports(data.rows)
      } 
      catch (error) {
        console.error('Error fetching data:', error);
        setMedicalReports([])
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
    fetchDoctor(); 
    fetchPatient();
    fetchMedicalReport();
  }, [refresh]);

  function addRefresh() {
    setRefresh(refresh + 1)
  }
  const handleMedicalReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const newMedicalReportObj = new MedicalReport(
        Number(newMedicalReport.hastaID),
        Number(newMedicalReport.doktorID),
        newMedicalReport.raporTarihi,
        newMedicalReport.raporUrl,
        newMedicalReport.raporIcerigi
      );
      console.log(newMedicalReportObj)
      await addNewMedicalReportToDatabase(newMedicalReportObj);
      setNewMedicalReport(initialMedicalReportState);
    }
    catch (error) {
      console.error('Tıbbi rapor eklenirken hata oluştu:', error);
    }
    e.target.reset();
  };
  async function addNewMedicalReportToDatabase(newMedicalReportObj) {
    try {
      const sql = `INSERT INTO MedicalReport
        (hastaID, doktorID, raporTarihi, raporUrl, raporIcerigi) VALUES(?, ?, ?, ?, ?)`;
      const values = [
        newMedicalReportObj.hastaID,
        newMedicalReportObj.doktorID,
        newMedicalReportObj.raporTarihi,
        newMedicalReportObj.raporUrl,
        newMedicalReportObj.raporIcerigi
      ];
      const response = await fetch('/api/addData/MedicalReport', {
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
  async function updateReportInDatabase() {
    try {
      const sql = `UPDATE MedicalReport SET 
        hastaID = ?, 
        doktorID = ?, 
        raporTarihi = ?, 
        raporUrl = ?,
        raporIcerigi = ?
        WHERE raporID = ?`;

      const values = [
        newMedicalReport.hastaID,
        newMedicalReport.doktorID,
        newMedicalReport.raporTarihi,
        newMedicalReport.raporUrl,
        newMedicalReport.raporIcerigi,
        editReportID
      ]
      const response = await fetch('/api/updateData/MedicalReport', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sql, values }),
      });

      const result = await response.json();
      if (response.ok) {
        console.log('User added successfully:', result);
        setEditReportID(null)
        setIsSuccess(true);
        addRefresh()
        setNewMedicalReport(initialMedicalReportState)
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
  async function deleteReportFromDatabase(deleteID) {
    try {
      const response = await fetch('/api/deleteData/MedicalReport', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nameID: "raporID", ID: deleteID })
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
      <h2 className="text-2xl font-bold mb-4">Tıbbi Raporlar</h2>
      <ul className="bg-gray-100 p-4 rounded-lg">
        {medicalReports.map(report => (
          <li key={report.raporID} className="mb-2 flex justify-between items-center">
            {editReportID === report.raporID ? (
              <div>
                <select
                  name='HastaID'
                  className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
                  defaultValue={(() => {
                    newMedicalReport.hastaID = report.hastaID;
                    return report.hastaID;
                  })()}
                  onChange={(e) => setNewMedicalReport({ ...newMedicalReport, hastaID: e.target.value })} >
                  <option value="">Hasta seciniz</option>
                  {patients.map(patient => (
                    <option key={patient.hastaID} value={patient.hastaID}>{patient.ad}</option>
                  ))}
                </select>
                <select
                  name='DoktorID'
                  className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
                  defaultValue={(() => {
                    newMedicalReport.doktorID = report.doktorID;
                    return report.doktorID;
                  })()}
                  onChange={(e) => setNewMedicalReport({ ...newMedicalReport, doktorID: e.target.value })} >
                  <option value="">Doktor seciniz</option>
                  {doctors.map(doctor => (
                    <option key={doctor.doktorID} value={doctor.doktorID}>{doctor.ad}</option>
                  ))}
                </select>
                <input
                  defaultValue={(() => {
                    const date = new Date(report.raporTarihi);
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    newMedicalReport.raporTarihi = `${year}-${month}-${day}`;
                    return `${year}-${month}-${day}`;
                  })()}
                  onChange={(e) => { newMedicalReport.raporTarihi = e.target.value.trim() }}
                />
                <input
                  defaultValue={(() => {
                    newMedicalReport.raporUrl = report.raporUrl;
                    return report.raporUrl;
                  })()}
                  onChange={(e) => { newMedicalReport.raporUrl = e.target.value.trim() }}
                />
                <input
                  defaultValue={(() => {
                    newMedicalReport.raporIcerigi = report.raporIcerigi;
                    return JSON.stringify(report.raporIcerigi);
                  })()}
                  onChange={(e) => { newMedicalReport.raporIcerigi = e.target.value.trim() }}
                />
                <button
                  className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => updateReportInDatabase()}>Güncelle
                </button>
                <button
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => setEditReportID(null)}>İptal
                </button>
              </div>
            ) : (
              <span className="text-lg font-semibold">{report.raporUrl}</span>
            )}

            <div>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setEditReportID(report.raporID)}>Düzenle
              </button>
              <button
                className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={() => deleteReportFromDatabase(report.raporID)}>Sil</button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-8 mb-4">Yeni Tıbbi Rapor Ekle</h2>
      <form onSubmit={(e) => handleMedicalReportSubmit(e)} className="mb-8">

        <select
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewMedicalReport({ ...newMedicalReport, hastaID: e.target.value.trim() })} >
          <option value="">Hasta seciniz</option>
          {patients.map(patient => (
            <option key={patient.hastaID} value={patient.hastaID}>{patient.ad}</option>
          ))}
        </select>
        <select
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewMedicalReport({ ...newMedicalReport, doktorID: e.target.value.trim() })} >
          <option value="">Doktor seciniz</option>
          {doctors.map(doctor => (
            <option key={doctor.doktorID} value={doctor.doktorID}>{doctor.ad}</option>
          ))}
        </select>
        <input
          type="date"
          name="raporTarihi"
          placeholder="Rapor Tarihi"
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewMedicalReport({ ...newMedicalReport, [e.target.name]: e.target.value.trim() })}
        />
        <br />
        <input
          type="url"
          name="raporUrl"
          placeholder="Rapor Linki"
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewMedicalReport({ ...newMedicalReport, [e.target.name]: e.target.value.trim() })}
        />
        <input
          type="text"
          name="raporIcerigi"
          placeholder="Rapor Icerigi"
          className="border border-gray-300 px-4 py-2 rounded-lg mb-2"
          onChange={(e) => setNewMedicalReport({ ...newMedicalReport, [e.target.name]: e.target.value.trim() })}
        />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg">Ekle</button>
      </form>
    </>
  )
}