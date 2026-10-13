import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

import { MainPortal } from './pages/MainPortal';
import { LoginPage } from './pages/LoginPage';
import { CreateATTPage } from './pages/CreateATTPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ATTDetailsPage } from './pages/ATTDetailsPage';
import { MasterDataPage } from './pages/MasterDataPage';
import { PrintATTLocalPage } from './pages/PrintATTLocalPage';
import { PrintATTAbroadPage } from './pages/PrintATTAbroadPage';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen mesh-bg text-slate-900 selection:bg-blue-700 selection:text-white">
          <Toaster 
            position="top-right" 
            toastOptions={{ 
              duration: 4000, 
              style: { 
                borderRadius: '16px', 
                background: '#0F172A', 
                color: '#fff', 
                fontSize: '13px', 
                fontWeight: 600 
              } 
            }} 
          />
          <Header />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MainPortal />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/att/:referenceNo" element={<ATTDetailsPage />} />
              <Route path="/att/:referenceNo/print/local" element={<PrintATTLocalPage />} />
              <Route path="/att/:referenceNo/print/abroad" element={<PrintATTAbroadPage />} />

              {/* Protected Routes (Require Login) */}
              <Route
                path="/att/new"
                element={
                  <ProtectedRoute>
                    <CreateATTPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/att/:referenceNo/edit"
                element={
                  <ProtectedRoute>
                    <CreateATTPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/att/edit/:referenceNo"
                element={
                  <ProtectedRoute>
                    <CreateATTPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/master-data"
                element={
                  <ProtectedRoute>
                    <MasterDataPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
