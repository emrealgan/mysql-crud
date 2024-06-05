"use client"
import PatientList from '@/components/PatientList';
import DoctorList from '@/components/DoctorList';
import AppointmentList from '@/components/AppointmentList';
import ReportList from '@/components/ReportList';
import HospitalList from '@/components/HospitalList';
import SpecialtyList from '@/components/SpecialtyList';

export default function Admin() {
   
  return (

    <div className="container mx-auto px-4 bg-gray-50">
      <PatientList/>
      <DoctorList/>
      <AppointmentList/>
      <ReportList/>  
      <HospitalList/>
      <SpecialtyList/>

    </div>
  );
}