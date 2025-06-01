import React from 'react';
import { Link } from 'react-router-dom';

const DoctorPanel = () => {
  return (
    <div>
      {/* ... existing code ... */}
      <ul>
        <li>
          <Link to="/doctor-panel/tomography">
            <i className="fas fa-x-ray"></i>
            <span>Tomografi Girişi</span>
          </Link>
        </li>
        <li>
          <Link to="/doctor/patient-results">
            <i className="fas fa-clipboard-list"></i>
            <span>Hasta Sonuçları</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default DoctorPanel; 