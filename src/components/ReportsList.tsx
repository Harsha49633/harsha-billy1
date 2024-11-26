import React from 'react';
import { Report } from '../types';
import { AlertTriangle } from 'lucide-react';

interface ReportsListProps {
  reports: Report[];
}

const ReportsList: React.FC<ReportsListProps> = ({ reports }) => {
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Reports</h2>
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="text-red-500" />
              <span className="font-semibold">{report.bullyingType}</span>
            </div>
            <p className="text-gray-600">Location: {report.location.address}</p>
            <p className="text-gray-600">
              Reported: {new Date(report.timestamp).toLocaleDateString()}
            </p>
            {report.evidenceLinks.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-semibold">Evidence:</p>
                <ul className="list-disc list-inside">
                  {report.evidenceLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
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
  );
};

export default ReportsList;