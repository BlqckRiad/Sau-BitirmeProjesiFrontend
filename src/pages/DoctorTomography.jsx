import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './DoctorTomography.module.css';

const DoctorTomography = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientDetails, setPatientDetails] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.userRoleID !== 2) {
      navigate('/');
      return;
    }

    fetchPatients();
  }, [user, navigate]);

  const fetchPatients = async () => {
    if (!user?.userID) {
      setError('Kullanıcı bilgileri yüklenemedi. Lütfen tekrar giriş yapın.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://bitirmeiys.enesozbuganli.com/api/Appointment/GetAllDoctorsUser?doctorId=${user.userID}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Hasta listesi yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      setPatients(data);
      
      // Fetch details for each patient
      data.forEach(patient => {
        fetchPatientDetails(patient.userID);
      });
    } catch (error) {
      console.error('Hasta listesi yükleme hatası:', error);
      setError('Hasta listesi yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatientDetails = async (userId) => {
    try {
      const response = await fetch(`https://bitirmeuser.enesozbuganli.com/api/User/GetKisiWithID?id=${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Hasta detayları yüklenemedi');
      }

      const data = await response.json();
      setPatientDetails(prev => ({
        ...prev,
        [userId]: data
      }));
    } catch (error) {
      console.error('Hasta detayı yükleme hatası:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Hasta listesi yükleniyor, lütfen bekleyin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={fetchPatients}>Tekrar Dene</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Tomografi Sonuç Girişi</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.patientSelection}>
          <h2>Hasta Seçimi</h2>
          <div className={styles.patientList}>
            {patients.map((patient) => {
              const details = patientDetails[patient.userID];
              return (
                <div
                  key={patient.userID}
                  className={`${styles.patientCard} ${selectedPatient?.userID === patient.userID ? styles.selected : ''}`}
                  onClick={() => {
                    setSelectedPatient(patient);
                    navigate(`/doctor-panel/tomography/upload?patientId=${patient.userID}&patientName=${encodeURIComponent(details.name + ' ' + details.surName)}`);
                  }}
                >
                  {details && (
                    <>
                      <img
                        src={details.userImageUrl || 'https://via.placeholder.com/50'}
                        alt={`${details.name} ${details.surName}`}
                        className={styles.patientImage}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://via.placeholder.com/50';
                        }}
                      />
                      <div className={styles.patientInfo}>
                        <h3>{details.name} {details.surName}</h3>
                        <p>{details.email}</p>
                        <p>{details.phoneNumber}</p>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {selectedPatient && (
          <div className={styles.tomographyForm}>
            <h2>Tomografi Sonuç Girişi</h2>
            <form>
              {/* Tomografi form alanları buraya eklenecek */}
              <p>Seçilen hasta: {patientDetails[selectedPatient.userID]?.name} {patientDetails[selectedPatient.userID]?.surName}</p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorTomography; 