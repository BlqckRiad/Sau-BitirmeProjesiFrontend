import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from './DoctorAppointments.module.css';

const DoctorAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('Tümü');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.userRoleID !== 2) {
      navigate('/');
      return;
    }

    fetchAppointments();
  }, [user, navigate]);

  const fetchAppointments = async () => {
    if (!user?.userID) {
      setError('Kullanıcı bilgileri yüklenemedi. Lütfen tekrar giriş yapın.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`https://bitirmeiys.enesozbuganli.com/api/Appointment/GetAllDoctorAppointments?doctorId=${user.userID}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Randevular yüklenirken bir hata oluştu');
      }

      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('Randevu yükleme hatası:', error);
      setError('Randevular yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    if (!user?.userID) {
      alert('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
      navigate('/login');
      return;
    }

    try {
      setUpdatingStatus(true);
      const response = await fetch('https://bitirmeiys.enesozbuganli.com/api/Appointment/ChangeAppointmentStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          AppointmentID: appointmentId,
          ChangerUserID: user.userID,
          Status: parseInt(newStatus)
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Randevu durumu güncellenirken bir hata oluştu');
      }

      await fetchAppointments();
    } catch (error) {
      console.error('Durum güncelleme hatası:', error);
      alert('Randevu durumu güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return '#ffc107';
      case 1:
        return '#28a745';
      case 2:
        return '#17a2b8';
      case 3:
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Bekliyor';
      case 1:
        return 'Onaylandı';
      case 2:
        return 'Tamamlandı';
      case 3:
        return 'İptalEdildi';
      default:
        return 'Bilinmiyor';
    }
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

  const filteredAppointments = selectedStatus === 'Tümü' 
    ? appointments 
    : appointments.filter(app => getStatusText(app.status) === selectedStatus);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Randevularınız yükleniyor, lütfen bekleyin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={fetchAppointments}>Tekrar Dene</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Randevu Listesi</h1>
        <div className={styles.statusFilter}>
          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.statusSelect}
          >
            <option value="Tümü">Tüm Randevular</option>
            <option value="Bekliyor">Bekleyen</option>
            <option value="Onaylandı">Onaylanan</option>
            <option value="Tamamlandı">Tamamlanan</option>
            <option value="İptalEdildi">İptal Edilen</option>
          </select>
        </div>
      </div>

      <div className={styles.appointmentsList}>
        {filteredAppointments.length === 0 ? (
          <div className={styles.noAppointments}>
            <p>Seçilen durumda randevu bulunmamaktadır.</p>
          </div>
        ) : (
          filteredAppointments.map((appointment) => (
            <div key={appointment.appointmentID} className={styles.appointmentCard}>
              <div className={styles.appointmentHeader}>
                <h3>{appointment.appointmentTitle || 'Randevu'}</h3>
                <div className={styles.statusContainer}>
                  <select
                    value={appointment.status}
                    onChange={(e) => handleStatusChange(appointment.appointmentID, e.target.value)}
                    className={styles.statusSelect}
                    disabled={updatingStatus}
                    style={{ backgroundColor: getStatusColor(appointment.status), color: 'white' }}
                  >
                    <option value="0">Bekliyor</option>
                    <option value="1">Onaylandı</option>
                    <option value="2">Tamamlandı</option>
                    <option value="3">İptal Edildi</option>
                  </select>
                </div>
              </div>

              <div className={styles.appointmentDetails}>
                <div className={styles.timeInfo}>
                  <div className={styles.timeBlock}>
                    <label>Randevu Başlangıcı:</label>
                    <p>{formatDate(appointment.appointmentDateStart)}</p>
                  </div>
                  <div className={styles.timeBlock}>
                    <label>Randevu Bitişi:</label>
                    <p>{formatDate(appointment.appointmentDateFinish)}</p>
                  </div>
                </div>

                <div className={styles.patientInfo}>
                  <h4>Hasta Bilgileri</h4>
                  <PatientInfo userId={appointment.userID} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Hasta bilgilerini gösteren alt bileşen
const PatientInfo = ({ userId }) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientInfo = async () => {
      try {
        const response = await fetch(`https://bitirmeuser.enesozbuganli.com/api/User/GetKisiWithID?id=${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Hasta bilgileri yüklenemedi');
        }

        const data = await response.json();
        setPatient(data);
      } catch (error) {
        console.error('Hasta bilgisi yükleme hatası:', error);
        setError('Hasta bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientInfo();
  }, [userId]);

  if (loading) {
    return <div className={styles.patientLoading}>Hasta bilgileri yükleniyor...</div>;
  }

  if (error || !patient) {
    return <div className={styles.patientError}>Hasta bilgileri görüntülenemiyor</div>;
  }

  return (
    <div className={styles.patientCard}>
      <img 
        src={patient.userImageUrl || 'https://via.placeholder.com/50'} 
        alt={`${patient.name} ${patient.surName}`}
        className={styles.patientImage}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://via.placeholder.com/50';
        }}
      />
      <div className={styles.patientDetails}>
        <p className={styles.patientName}>{patient.name} {patient.surName}</p>
        <p className={styles.patientEmail}>{patient.email}</p>
        <p className={styles.patientPhone}>{patient.phoneNumber}</p>
      </div>
    </div>
  );
};

export default DoctorAppointments; 