import React, { useState, useEffect } from 'react';
import styles from './NewAppointment.module.css';

const NewAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointmentTitle, setAppointmentTitle] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  // Doktorları getir
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('https://bitirmeuser.enesozbuganli.com/api/User/GetAllUsers');
        if (!response.ok) {
          throw new Error('Doktorlar yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        const doctorsList = data.filter(user => user.userRoleID === 2);
        setDoctors(doctorsList);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Seçilen doktorun randevularını getir
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!selectedDoctor) return;

      try {
        const response = await fetch(`https://bitirmeiys.enesozbuganli.com/api/Appointment/GetAllDoctorAppointments?doctorId=${selectedDoctor.userID}`);
        if (!response.ok) {
          throw new Error('Randevular yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setAppointments(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchAppointments();
  }, [selectedDoctor]);

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setCurrentStep(2);
  };

  // Takvim için tarih oluştur
  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    for (let d = new Date(today); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d));
    }
    return dates;
  };

  // Saat dilimlerini oluştur
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      if (hour === 13) continue; // Öğle arası
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  // Seçilen tarih ve saat için randevu var mı kontrol et
  const isTimeSlotBooked = (date, time) => {
    const selectedDateTime = new Date(date);
    const [hours] = time.split(':');
    selectedDateTime.setHours(parseInt(hours), 0, 0, 0);

    return appointments.some(appointment => {
      const startTime = new Date(appointment.appointmentDateStart);
      const endTime = new Date(appointment.appointmentDateFinish);
      return selectedDateTime >= startTime && selectedDateTime < endTime;
    });
  };

  // Randevu oluştur
  const handleCreateAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !appointmentTitle) {
      setError('Lütfen tüm alanları doldurun');
      return;
    }

    try {
      // Seçilen tarihi al
      const appointmentDate = new Date(selectedDate);
      
      // Saati ayarla (Türkiye saati UTC+3)
      const [hours] = selectedTime.split(':');
      appointmentDate.setHours(parseInt(hours), 0, 0, 0);

      // UTC'ye çevirirken 3 saat ekle
      const utcDate = new Date(appointmentDate.getTime() + (3 * 60 * 60 * 1000));

      const appointmentData = {
        userID: 1, // Bu kısmı gerçek kullanıcı ID'si ile değiştirin
        doctorID: selectedDoctor.userID,
        appointmentDateStart: utcDate.toISOString(),
        appointmentDateFinish: new Date(utcDate.getTime() + 60 * 60 * 1000).toISOString(), // 1 saat sonrası
        appointmentTitle: appointmentTitle
      };

      const response = await fetch('https://bitirmeiys.enesozbuganli.com/api/Appointment/AddAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      if (!response.ok) {
        throw new Error('Randevu oluşturulurken bir hata oluştu');
      }

      // Başarılı randevu oluşturma
      alert('Randevu başarıyla oluşturuldu');
      setCurrentStep(1);
      setSelectedDoctor(null);
      setSelectedDate(null);
      setSelectedTime(null);
      setAppointmentTitle('');
    } catch (err) {
      setError(err.message);
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
      <h2 className={styles.title}>Yeni Randevu Oluştur</h2>
      
      <div className={styles.stepIndicator}>
        <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>
          <span>1</span>
          <p>Doktor Seçimi</p>
        </div>
        <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>
          <span>2</span>
          <p>Tarih ve Saat</p>
        </div>
      </div>

      {currentStep === 1 && (
        <div className={styles.doctorSelection}>
          <h3>Doktor Seçin</h3>
          <div className={styles.doctorList}>
            {doctors.map((doctor) => (
              <div
                key={doctor.userID}
                className={`${styles.doctorCard} ${selectedDoctor?.userID === doctor.userID ? styles.selected : ''}`}
                onClick={() => handleDoctorSelect(doctor)}
              >
                <img src={doctor.userImageUrl} alt={doctor.name} className={styles.doctorImage} />
                <div className={styles.doctorInfo}>
                  <h4>Dr. {doctor.name} {doctor.surName}</h4>
                  <p>{doctor.userEmail}</p>
                  <p>{doctor.userTelNo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentStep === 2 && selectedDoctor && (
        <div className={styles.appointmentForm}>
          <div className={styles.calendar}>
            <h3>Randevu Tarihi Seçin</h3>
            <div className={styles.dateGrid}>
              {generateCalendarDates().map((date) => (
                <div
                  key={date.toISOString()}
                  className={`${styles.dateCell} ${selectedDate?.toDateString() === date.toDateString() ? styles.selected : ''}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className={styles.dayName}>{date.toLocaleDateString('tr-TR', { weekday: 'short' })}</span>
                  <span className={styles.dayNumber}>{date.getDate()}</span>
                  <span className={styles.monthName}>{date.toLocaleDateString('tr-TR', { month: 'short' })}</span>
                </div>
              ))}
            </div>
          </div>

          {selectedDate && (
            <div className={styles.timeSelection}>
              <h3>Randevu Saati Seçin</h3>
              <div className={styles.timeGrid}>
                {generateTimeSlots().map((time) => {
                  const isBooked = isTimeSlotBooked(selectedDate, time);
                  return (
                    <div
                      key={time}
                      className={`${styles.timeSlot} ${isBooked ? styles.booked : ''} ${selectedTime === time ? styles.selected : ''}`}
                      onClick={() => !isBooked && setSelectedTime(time)}
                    >
                      {time}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {selectedTime && (
            <div className={styles.appointmentDetails}>
              <h3>Randevu Detayları</h3>
              <div className={styles.formGroup}>
                <label htmlFor="title">Randevu Başlığı</label>
                <input
                  type="text"
                  id="title"
                  value={appointmentTitle}
                  onChange={(e) => setAppointmentTitle(e.target.value)}
                  placeholder="Randevu başlığını girin"
                />
              </div>
              <button
                className={styles.submitBtn}
                onClick={handleCreateAppointment}
                disabled={!appointmentTitle}
              >
                Randevu Oluştur
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NewAppointment; 