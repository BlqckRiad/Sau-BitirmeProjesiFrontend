import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './PatientDashboard.module.css';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Kullanıcı giriş yapmamışsa veya doktor ise ana sayfaya yönlendir
    if (!user || user.userRoleID !== 1) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Hasta Paneli</h1>
        <div className={styles.userInfo}>
          <img 
            src={user.userImageUrl || 'https://via.placeholder.com/50'} 
            alt="Profil" 
            className={styles.profileImage}
          />
          <div className={styles.userDetails}>
            <h2>{user.name} {user.surName}</h2>
            <p>{user.userEmail}</p>
          </div>
        </div>
      </div>

      <div className={styles.dashboardContent}>
        <div className={styles.card}>
          <h3>Randevularım</h3>
          <p>Yaklaşan randevularınızı görüntüleyin ve yönetin.</p>
          <button onClick={() => navigate('/my-appointments')}>Randevularımı Görüntüle</button>
        </div>

        <div className={styles.card}>
          <h3>Profil Bilgilerim</h3>
          <p>Kişisel bilgilerinizi güncelleyin.</p>
          <button onClick={() => navigate('/my-profile')}>Profili Düzenle</button>
        </div>

        <div className={styles.card}>
          <h3>Doktorlar</h3>
          <p>Uzman doktorlarımızı inceleyin ve randevu alın.</p>
          <button onClick={() => navigate('/doctors')}>Doktorları Görüntüle</button>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard; 