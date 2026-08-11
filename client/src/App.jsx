import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

import { MainPortal } from './pages/MainPortal';
import { CreateATTPage } from './pages/CreateATTPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ATTDetailsPage } from './pages/ATTDetailsPage';
import { MasterDataPage } from './pages/MasterDataPage';
import { PrintATTLocalPage } from './pages/PrintATTLocalPage';
import { PrintATTAbroadPage } from './pages/PrintATTAbroadPage';

export function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<MainPortal />} />
            <Route path="/att/new" element={<CreateATTPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/master-data" element={<MasterDataPage />} />
            <Route path="/att/:referenceNo" element={<ATTDetailsPage />} />
            <Route path="/att/:referenceNo/print/local" element={<PrintATTLocalPage />} />
            <Route path="/att/:referenceNo/print/abroad" element={<PrintATTAbroadPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
