
import React, { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import LocationList from './components/LocationList';
import LocationDetail from './components/LocationDetail';
import HRAssistant from './components/HRAssistant';
import UITemplate from './UITemplate';
import Layout from './components/Layout';
import { Employee, Location } from './types';

const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', name: 'John Doe', role: 'Senior Developer', department: 'Tech', status: 'Active', joinDate: '2022-01-15', email: 'john.doe@hurema.com' },
  { id: '2', name: 'Jane Smith', role: 'HR Manager', department: 'Human Resource', status: 'Active', joinDate: '2021-05-10', email: 'jane.smith@hurema.com' },
  { id: '3', name: 'Robert Brown', role: 'Sales Lead', department: 'Commercial', status: 'On Leave', joinDate: '2023-02-20', email: 'robert.b@hurema.com' },
  { id: '4', name: 'Maria Garcia', role: 'Project Manager', department: 'Tech', status: 'Active', joinDate: '2022-11-05', email: 'maria.g@hurema.com' },
  { id: '5', name: 'James Wilson', role: 'Accountant', department: 'Finance', status: 'Terminated', joinDate: '2020-09-12', email: 'james.w@hurema.com' },
];

const INITIAL_LOCATIONS: Location[] = [
  { id: '1', name: 'Headquarters Jakarta', address: 'Jl. Jend. Sudirman No. 1, Jakarta Pusat', latitude: -6.2088, longitude: 106.8456, radius_meters: 100, is_active: true },
  { id: '2', name: 'Branch Office Bandung', address: 'Jl. Asia Afrika No. 10, Bandung', latitude: -6.9175, longitude: 107.6191, radius_meters: 150, is_active: true },
];

const App = () => {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [locations, setLocations] = useState<Location[]>(INITIAL_LOCATIONS);

  const handleAddEmployee = (newEmp: Employee) => {
    setEmployees(prev => [newEmp, ...prev]);
  };

  const handleUpdateEmployee = (updatedEmp: Employee) => {
    setEmployees(prev => prev.map(emp => emp.id === updatedEmp.id ? updatedEmp : emp));
  };

  const handleDeleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
  };

  const handleAddLocation = (newLoc: Location) => {
    setLocations(prev => [newLoc, ...prev]);
  };

  const handleUpdateLocation = (updatedLoc: Location) => {
    setLocations(prev => prev.map(loc => loc.id === updatedLoc.id ? updatedLoc : loc));
  };

  const handleDeleteLocation = (id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
  };

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard employees={employees} />} />
          <Route path="/employees" element={<EmployeeList employees={employees} onAdd={handleAddEmployee} />} />
          <Route path="/employees/:id" element={<EmployeeDetail employees={employees} onUpdate={handleUpdateEmployee} onDelete={handleDeleteEmployee} />} />
          
          <Route path="/master/lokasi" element={<LocationList locations={locations} onAdd={handleAddLocation} />} />
          <Route path="/master/lokasi/:id" element={<LocationDetail locations={locations} onUpdate={handleUpdateLocation} onDelete={handleDeleteLocation} />} />

          <Route path="/ai-assistant" element={<HRAssistant />} />
          <Route path="/ui-template" element={<UITemplate />} />
          <Route path="/attendance" element={<div className="p-12 text-center text-slate-500 bg-white rounded-3xl border-2 border-dashed border-slate-200">Attendance Data synced with Supabase Realtime</div>} />
          <Route path="/documents" element={<div className="p-12 text-center text-slate-500 bg-white rounded-3xl border-2 border-dashed border-slate-200">Google Drive API Integrated Explorer</div>} />
          <Route path="/settings" element={<div className="p-12 text-center text-slate-500 bg-white rounded-3xl border-2 border-dashed border-slate-200">Configuration panel for 500 Employee Tier</div>} />
          
          <Route path="/master/jadwal" element={<div className="p-12 text-center text-slate-500 bg-white rounded-3xl border-2 border-dashed border-slate-200">Master Data Jadwal Karyawan</div>} />
          <Route path="/master/performa" element={<div className="p-12 text-center text-slate-500 bg-white rounded-3xl border-2 border-dashed border-slate-200">Performance Management Master</div>} />
          <Route path="/master/keuangan" element={<div className="p-12 text-center text-slate-500 bg-white rounded-3xl border-2 border-dashed border-slate-200">Financial Records & Payroll Master</div>} />
          
          <Route path="*" element={<Dashboard employees={employees} />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;