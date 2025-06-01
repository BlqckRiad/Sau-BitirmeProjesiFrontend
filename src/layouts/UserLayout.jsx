import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './UserLayout.module.css';

const UserLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // localStorage'dan kullanıcı bilgilerini al
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
          navigate('/login');
          return;
        }
 
        const parsedUser = JSON.parse(storedUser);
        
        // Kullanıcı doktor ise ana sayfaya yönlendir
        if (parsedUser.userRoleID !== 1) {
          navigate('/');
          return;
        }

        // API'den kullanıcı bilgilerini al
        const response = await fetch(`https://bitirmeuser.enesozbuganli.com/api/User/GetKisiWithID?id=${parsedUser.userID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${parsedUser.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Kullanıcı bilgileri alınamadı');
        }

        const data = await response.json();
        setUserDetails(data);
        console.log(data);
      } catch (error) {
        console.error('Kullanıcı bilgileri alınırken hata:', error);
        // Hata durumunda login sayfasına yönlendir
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!userDetails) return null;

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <h1>Hasta Paneli</h1>
        </div>
        
        <div className={styles.userInfo}>
          <img 
            src={userDetails.userImageUrl || 'https://via.placeholder.com/100'} 
            alt="Profil" 
            className={styles.profileImage}
          />
          <div className={styles.userDetails}>
            <h2>{userDetails.name} {userDetails.surName}</h2>
            <p>{userDetails.userEmail}</p>
           
          </div>
        </div>

        <nav className={styles.navigation}>
          <button 
            className={styles.navButton} 
            onClick={() => navigate('/user-panel')}
          >
            Ana Sayfa
          </button>
          <button 
            className={styles.navButton} 
            onClick={() => navigate('/user-panel/appointments')}
          >
            Randevularım
          </button>
          <button 
            className={styles.navButton} 
            onClick={() => navigate('/user-panel/profile')}
          >
            Profil Bilgilerim
          </button>
          
          <button 
            className={styles.navButton} 
            onClick={handleLogout}
          >
            Çıkış Yap
          </button>
        </nav>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h2>Hoş Geldiniz, {userDetails.name}</h2>
            <img 
                  src={userDetails.userImageUrl || 'https://via.placeholder.com/40'} 
                  alt="Profil" 
                  className={styles.headerProfileImage}
                />
          </div>
        </header>

        <div className={styles.content}>
          <Outlet context={{ userDetails }} />
        </div>
      </main>
    </div>
  );
};

export default UserLayout; 