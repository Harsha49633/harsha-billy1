import React from 'react';
import { Report } from '../types';
import { AlertTriangle, ExternalLink } from 'lucide-react';

interface AdminDashboardProps {
  reports: Report[];
  onReportToCybercrime: (report: Report) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ reports, onReportToCybercrime }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
      
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Pending Reports</h3>
        <div className="space-y-4">
          {reports.filter(r => r.status === 'pending').map((report) => (
            <div key={report.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-red-500" />
                  <span className="font-semibold">{report.bullyingType}</span>
                </div>
                <button
                  onClick={() => onReportToCybercrime(report)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Report to Authorities
                  <ExternalLink size={16} />
                </button>
              </div>
              <p>Location: {report.location.address}</p>
              <p>Date: {new Date(report.timestamp).toLocaleDateString()}</p>
              {report.evidenceLinks.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-semibold">Evidence:</p>
                  <ul className="list-disc list-inside">
                    {report.evidenceLinks.map((link, index) => (
                      <li key={index}>
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                          Evidence #{index + 1}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;