import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './DoctorPanel.module.css';

const DoctorPanel = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.profileSection}>
          <div className={styles.profileImage}>
            <img src={user?.userImageUrl || 'https://via.placeholder.com/150'} alt="Profile" />
          </div>
          <h2 className={styles.doctorName}>{user?.name} {user?.surName}</h2>
          <p className={styles.doctorTitle}>Doktor</p>
        </div>

        <nav className={styles.navigation}>
          <button className={`${styles.navItem} ${styles.active}`}>
            <i className="fas fa-home"></i>
            Ana Sayfa
          </button>
          <button 
            className={styles.navItem}
            onClick={() => navigate('/doctor-panel/appointments')}
          >
            <i className="fas fa-calendar-check"></i>
            Randevularım
          </button>
          <button 
            className={styles.navItem}
            onClick={() => navigate('/doctor-panel/tomography')}
          >
            <i className="fas fa-x-ray"></i>
            Tomografi Girişi
          </button>
          <button 
            className={styles.navItem}
            onClick={() => navigate('/doctor/patient-results')}
          >
            <i className="fas fa-clipboard-list"></i>
            Hasta Sonuçları
          </button>
          <button 
            className={styles.navItem}
            onClick={() => navigate('/doctor-panel/profile')}
          >
            <i className="fas fa-user"></i>
            Profil
          </button>
          {/* Diğer menü öğeleri buraya eklenecek */}
        </nav>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i>
          Çıkış Yap
        </button>
      </div>

      <div className={styles.mainContent}>
        <div className={styles.header}>
          <h1>Doktor Paneli</h1>
          <div className={styles.dateTime}>
            <span>{new Date().toLocaleDateString('tr-TR')}</span>
          </div>
        </div>

        <div className={styles.dashboard}>
          <div className={styles.welcomeCard}>
            <h2>Hoş Geldiniz, Dr. {user?.name} {user?.surName}</h2>
            <p>Doktor panelinize hoş geldiniz. Buradan randevularınızı ve hasta bilgilerinizi yönetebilirsiniz.</p>
          </div>

          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className={styles.statInfo}>
                <h3>Bugünkü Randevular</h3>
                <p>0</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fas fa-users"></i>
              </div>
              <div className={styles.statInfo}>
                <h3>Toplam Hasta</h3>
                <p>0</p>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fas fa-clock"></i>
              </div>
              <div className={styles.statInfo}>
                <h3>Bekleyen Randevular</h3>
                <p>0</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorPanel; 