import React, { useState } from 'react';
import { Shield, LogOut } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ChatBot from './components/ChatBot';
import MapView from './components/Map';
import ReportsList from './components/ReportsList';
import AdminDashboard from './components/AdminDashboard';
import Community from './components/Community';
import Auth from './components/Auth';
import { Report, Story } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';

function App() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const { user, logout } = useAuth();

  const handleReportSubmit = async (reportData: any) => {
    if (!user) return;

    // Simulate geocoding with more realistic coordinates
    const geocodedLocation = {
      lat: parseFloat((Math.random() * 180 - 90).toFixed(6)),
      lng: parseFloat((Math.random() * 360 - 180).toFixed(6)),
      address: reportData.location
    };

    const newReport: Report = {
      id: Date.now().toString(),
      userId: user.id,
      name: reportData.name,
      age: parseInt(reportData.age),
      location: geocodedLocation,
      bullyingType: reportData.bullyingType,
      evidenceLinks: [reportData.evidenceLinks],
      timestamp: new Date(),
      status: 'pending'
    };

    setReports([...reports, newReport]);
  };

  const handleReportToCybercrime = (report: Report) => {
    const updatedReports = reports.map(r =>
      r.id === report.id ? { ...r, status: 'reported' as const } : r
    );
    setReports(updatedReports);
    
    // In a real app, this would make an API call to the cybercrime reporting system
    console.log('Reporting to cybercrime authorities:', report);
  };

  const handleAddStory = (story: Story) => {
    setStories([story, ...stories]);
  };

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-indigo-600 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield size={32} />
              <h1 className="text-3xl font-bold">CyberGuard</h1>
            </div>
            <nav className="flex items-center gap-6">
              <Link to="/" className="hover:text-indigo-200">Home</Link>
              <Link to="/community" className="hover:text-indigo-200">Community</Link>
              {user.isAdmin && (
                <Link to="/admin" className="hover:text-indigo-200">Admin</Link>
              )}
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-700 rounded-lg hover:bg-indigo-800 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                <div className="bg-white p-6 rounded-lg shadow-xl">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Talk to Billy</h2>
                  <p className="text-gray-600 mb-4">
                    Billy is here to help you report cyberbullying incidents safely and anonymously.
                  </p>
                  <ChatBot onReportSubmit={handleReportSubmit} />
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Incident Map</h2>
                  <MapView reports={reports} />
                </div>
                <ReportsList reports={reports} />
              </div>
            </div>
          } />
          <Route path="/community" element={
            <Community
              stories={stories}
              onAddStory={handleAddStory}
              onAddComment={() => {}}
            />
          } />
          {user.isAdmin && (
            <Route path="/admin" element={
              <AdminDashboard
                reports={reports}
                onReportToCybercrime={handleReportToCybercrime}
              />
            } />
          )}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Emergency Contacts</h3>
              <ul className="space-y-2">
                <li>National Bullying Hotline: 1-800-XXX-XXXX</li>
                <li>Cybercrime Report: 1-888-XXX-XXXX</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-indigo-300">Anti-Bullying Guide</a></li>
                <li><a href="#" className="hover:text-indigo-300">Online Safety Tips</a></li>
                <li><a href="#" className="hover:text-indigo-300">Support Groups</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">About Us</h3>
              <p className="text-gray-300">
                We're committed to creating a safer online environment by empowering individuals to report and prevent cyberbullying.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const AppWrapper = () => (
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
);

export default AppWrapper;