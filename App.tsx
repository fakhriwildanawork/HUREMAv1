
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Layout/Dashboard';
import EmployeeList from './components/EmployeeList';
import EmployeeDetail from './components/EmployeeDetail';
import LocationList from './components/Location/LocationList';
import LocationDetail from './components/Location/LocationDetail';
import LoginPage from './components/Location/LoginPage';
import UITemplate from './UITemplate';
import Layout from './components/Layout/Layout';
import LoadingOverlay from './components/ui/LoadingOverlay';
import { Employee, Location } from './types';
import { SupabaseService } from './services/supabase';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check Session & Initial Fetch
  useEffect(() => {
    const initApp = async () => {
      try {
        // Cek Auth Session
        const user = await SupabaseService.getCurrentUser();
        
        // Cek apakah ada kredensial Supabase (mendukung nama baru VITE_)
        // @ts-ignore
        const hasSupabase = !!(import.meta.env?.VITE_SUPABASE_URL || process.env?.VITE_SUPABASE_URL || process.env?.SUPABASE_URL);

        if (user || !hasSupabase) {
          setIsAuthenticated(true);
          await fetchData();
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  const fetchData = async () => {
    try {
      const [empData, locData] = await Promise.all([
        SupabaseService.getEmployees(),
        SupabaseService.getLocations()
      ]);
      setEmployees(empData as Employee[]);
      setLocations(locData as Location[]);
    } catch (e) {
      console.error("Gagal mengambil data dari Supabase:", e);
    }
  };

  const handleAddEmployee = async (newEmp: Employee) => {
    setEmployees(prev => [newEmp, ...prev]);
  };

  const handleUpdateEmployee = async (updatedEmp: Employee) => {
    setEmployees(prev => prev.map(emp => emp.id === updatedEmp.id ? updatedEmp : emp));
    try {
      await SupabaseService.saveEmployee(updatedEmp);
    } catch (e) {
      console.error("Gagal simpan ke Supabase:", e);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    setEmployees(prev => prev.filter(emp => emp.id !== id));
    try {
      await SupabaseService.deleteEmployee(id);
    } catch (e) {
      console.error("Gagal hapus dari Supabase:", e);
    }
  };

  const handleAddLocation = (newLoc: Location) => {
    setLocations(prev => [newLoc, ...prev]);
  };

  const handleUpdateLocation = async (updatedLoc: Location) => {
    setLocations(prev => prev.map(loc => loc.id === updatedLoc.id ? updatedLoc : loc));
    try {
      const savedLoc = await SupabaseService.saveLocation(updatedLoc);
      // Sync kembali jika database memberikan ID atau transformasi data
      if (savedLoc) {
        setLocations(prev => prev.map(loc => loc.id === updatedLoc.id ? savedLoc : loc));
      }
    } catch (e) {
      console.error("Gagal simpan lokasi ke Supabase:", e);
    }
  };

  const handleDeleteLocation = async (id: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== id));
    try {
      await SupabaseService.deleteLocation(id);
    } catch (e) {
      console.error("Gagal hapus lokasi dari Supabase:", e);
    }
  };

  if (isLoading) {
    return <LoadingOverlay isVisible message="Menyiapkan Workspace" submessage="Menghubungkan ke instance cloud HUREMA..." />;
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard employees={employees} />} />
          <Route path="/employees" element={<EmployeeList employees={employees} onAdd={handleAddEmployee} />} />
          <Route path="/employees/:id" element={<EmployeeDetail employees={employees} onUpdate={handleUpdateEmployee} onDelete={handleDeleteEmployee} />} />
          
          <Route path="/master/lokasi" element={<LocationList locations={locations} onAdd={handleAddLocation} />} />
          <Route path="/master/lokasi/:id" element={<LocationDetail locations={locations} onUpdate={handleUpdateLocation} onDelete={handleDeleteLocation} />} />

          <Route path="/ui-template" element={<UITemplate />} />
          <Route path="/attendance" element={<div className="p-12 text-center text-slate-500 bg-white rounded-3xl border-2 border-dashed border-slate-200">Data Presensi Realtime (Supabase)</div>} />
          <Route path="/documents" element={<div className="p-12 text-center text-slate-500 bg-white rounded-3xl border-2 border-dashed border-slate-200">Google Drive Integrated Explorer</div>} />
          <Route path="/settings" element={<div className="p-12 text-center text-slate-500 bg-white rounded-3xl border-2 border-dashed border-slate-200">Global System Configuration</div>} />
          
          <Route path="/master/jadwal" element={<div className="p-12 text-center text-slate-500 bg-white rounded-3xl border-2 border-dashed border-slate-200">Master Data Jadwal Kerja</div>} />
          <Route path="/master/performa" element={<div className="p-12 text-center text-slate-500 bg-white rounded-3xl border-2 border-dashed border-slate-200">Performance Management</div>} />
          <Route path="/master/keuangan" element={<div className="p-12 text-center text-slate-500 bg-white rounded-3xl border-2 border-dashed border-slate-200">Financial & Payroll Master</div>} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
