import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Doctors.module.css';

const Doctors = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://bitirmeuser.enesozbuganli.com/api/User/GetAllUsers');
        const data = await response.json();
        console.log('API Response:', data); // API yanıtını kontrol et
        
        // Sadece doktorları filtrele
        const doctors = data.filter(user => user.userRoleID === 2);
        console.log('Filtered Doctors:', doctors); // Filtrelenmiş doktorları kontrol et
        
        setAllDoctors(doctors);
      } catch (error) {
        console.error('Doktorlar yüklenemedi:', error);
        setAllDoctors([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <div className={styles.container}>
      <h1>Doktorlarımız</h1>
      <div className={styles.doctorsGrid}>
        {
          allDoctors.length === 0 ? (
            <div>Doktor bulunamadı.</div>
          ) : (
            allDoctors.map((item) => {
              console.log('Doctor Image URL:', item.userImageUrl); // Her doktorun resim URL'sini kontrol et
              return (
                <div onClick={() => navigate(`/appointment/${item.userID}`)} key={item.userID} className={styles.doctorCard}>
                  <img
                    src={
                      item.userImageUrl &&
                      (item.userImageUrl.endsWith('.jpg') ||
                       item.userImageUrl.endsWith('.jpeg') ||
                       item.userImageUrl.endsWith('.png') ||
                       item.userImageUrl.endsWith('.webp'))
                        ? item.userImageUrl
                        : '/default-avatar.png'
                    }
                    alt={`${item.name} ${item.surName}`}
                    className={styles.doctorImage}
                    onError={e => { e.target.src = '/default-avatar.png'; }}
                  />
                  <div className={styles.doctorInfo}>
                    <p className={styles.doctorName}>{item.name} {item.surName}</p>
                  </div>
                </div>
              );
            })
          )
        }
      </div>
    </div>
  );
};

export default Doctors;
