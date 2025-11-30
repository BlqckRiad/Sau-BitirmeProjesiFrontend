import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './DoctorPatientResults.module.css';

const DoctorPatientResults = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientResults, setPatientResults] = useState([]);
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

  const fetchPatientResults = async (userId) => {
    try {
      const response = await fetch(`https://bitirmeiys.enesozbuganli.com/api/XRayResult/GetXRayResultsWithUserID?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Tomografi sonuçları yüklenemedi');
      }

      const data = await response.json();
      // Sonuçları tarihe göre tersten sırala
      const sortedData = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
      setPatientResults(sortedData);
    } catch (error) {
      console.error('Tomografi sonuçları yükleme hatası:', error);
      setError('Tomografi sonuçları yüklenirken bir hata oluştu');
    }
  };

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    fetchPatientResults(patient.userID);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <h1>Hasta Diş Sonuçları</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.patientList}>
          <h2>Hastalarım</h2>
          {patients.map((patient) => {
            const details = patientDetails[patient.userID];
            return (
              <div
                key={patient.userID}
                className={`${styles.patientCard} ${selectedPatient?.userID === patient.userID ? styles.selected : ''}`}
                onClick={() => handlePatientSelect(patient)}
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

        <div className={styles.resultsSection}>
          {selectedPatient ? (
            <>
              <h2>Diş Sonuçları</h2>
              {patientResults.length === 0 ? (
                <p className={styles.noResults}>Bu hasta için henüz diş sonucu bulunmamaktadır.</p>
              ) : (
                <div className={styles.resultsList}>
                  {patientResults.map((result) => (
                    <div key={result.xRayResultID} className={styles.resultCard}>
                      <div className={styles.resultHeader}>
                        <h3>Diş #{result.xRayResultID}</h3>
                        <p className={styles.resultDate}>{formatDate(result.createdDate)}</p>
                      </div>
                      <div className={styles.resultContent}>
                        <div className={styles.resultImage}>
                          <img src={result.xRayNormalImageUrl} alt="Tomografi Görüntüsü" />
                        </div>
                        <div className={styles.resultDetails}>
                          <div className={styles.diagnosisSection}>
                            <h4>Teşhis Sonuçları</h4>
                            <p><strong>Başlık:</strong> {result.xRayTitle}</p>
                            <p><strong>Açıklama:</strong> {result.xRayDescription}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className={styles.noSelection}>
              <p>Lütfen bir hasta seçin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorPatientResults; 