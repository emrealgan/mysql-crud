"use client"
import PatientList from '@/components/PatientList';
import DoctorList from '@/components/DoctorList';
import AppointmentList from '@/components/AppointmentList';
import ReportList from '@/components/ReportList';
import HospitalList from '@/components/HospitalList';
import SpecialtyList from '@/components/SpecialtyList';
import { signOut, useSession } from 'next-auth/react';

export default function Admin() {
   
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }
  console.log(session);
  if (session.user.role !== "administrator") {
    return <div>You are not authenticated.</div>;
  }
  return (
    
    <div className="container mx-auto px-4 bg-gray-50">
      <button
        className="mt-2 p-2 bg-red-500 text-white"
        onClick={() => signOut()}
      >
        Logout
      </button>
      <PatientList/>
      <DoctorList/>
      <AppointmentList/>
      <ReportList/>  
      <HospitalList/>
      <SpecialtyList/>

    </div>
  );
}