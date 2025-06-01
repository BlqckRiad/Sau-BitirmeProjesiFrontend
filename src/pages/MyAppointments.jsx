import React, { useState, useEffect } from 'react';
import styles from './MyAppointments.module.css';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Randevuları getir
        const appointmentsResponse = await fetch('https://bitirmeiys.enesozbuganli.com/api/Appointment/GetAllUserAppointments?userId=1'); // userId'yi gerçek kullanıcı ID'si ile değiştirin
        if (!appointmentsResponse.ok) {
          throw new Error('Randevular yüklenirken bir hata oluştu');
        }
        const appointmentsData = await appointmentsResponse.json();

        // Her randevu için doktor bilgilerini getir
        const appointmentsWithDoctors = await Promise.all(
          appointmentsData.map(async (appointment) => {
            const doctorResponse = await fetch(`https://bitirmeuser.enesozbuganli.com/api/User/GetKisiWithID?id=${appointment.doctorID}`);
            if (!doctorResponse.ok) {
              throw new Error('Doktor bilgileri yüklenirken bir hata oluştu');
            }
            const doctorData = await doctorResponse.json();
            return {
              ...appointment,
              doctor: doctorData
            };
          })
        );

        setAppointments(appointmentsWithDoctors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await fetch('https://bitirmeiys.enesozbuganli.com/api/Appointment/DeleteAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          DeletedItemID: appointmentId,
          DeletedUserID: 1 // Gerçek kullanıcı ID'si ile değiştirilmeli
        })
      });

      if (!response.ok) {
        throw new Error('Randevu iptal edilirken bir hata oluştu');
      }

      // Randevuları yeniden yükle
      const updatedAppointments = appointments.map(appointment => {
        if (appointment.appointmentID === appointmentId) {
          return {
            ...appointment,
            status: 2, // İptal Edildi
            IsDeleted: true
          };
        }
        return appointment;
      });

      setAppointments(updatedAppointments);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return 'Beklemede';
      case 1:
        return 'Onaylandı';
      case 2:
        return 'İptal Edildi';
      default:
        return 'Bilinmiyor';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 0:
        return styles.pending;
      case 1:
        return styles.approved;
      case 2:
        return styles.cancelled;
      default:
        return '';
    }
  };

  if (loading) {
    return <div className={styles.loading}>Yükleniyor...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Randevularım</h2>
      
      {appointments.length === 0 ? (
        <div className={styles.noAppointments}>
          Henüz randevunuz bulunmamaktadır.
        </div>
      ) : (
        <div className={styles.appointmentList}>
          {appointments.map((appointment) => (
            <div key={appointment.appointmentID} className={styles.card}>
              <div className={styles.imageWrapper}>
                <img 
                  src={appointment.doctor?.userImageUrl || '/default-doctor.png'} 
                  alt={appointment.doctor?.name} 
                  className={styles.doctorImage} 
                />
              </div>

              <div className={styles.details}>
                <h3>Dr. {appointment.doctor?.name} {appointment.doctor?.surName}</h3>
                <p className={styles.title}>{appointment.appointmentTitle}</p>
                <p className={styles.datetime}>
                  <strong>Başlangıç:</strong> {formatDate(appointment.appointmentDateStart)}
                </p>
                <p className={styles.datetime}>
                  <strong>Bitiş:</strong> {formatDate(appointment.appointmentDateFinish)}
                </p>
                <p className={`${styles.status} ${getStatusClass(appointment.status)}`}>
                  {getStatusText(appointment.status)}
                </p>
              </div>

              <div className={styles.actions}>
                {appointment.status === 0 && !appointment.IsDeleted && (
                  <button 
                    className={styles.cancelBtn}
                    onClick={() => handleCancelAppointment(appointment.appointmentID)}
                  >
                    İptal Et
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
