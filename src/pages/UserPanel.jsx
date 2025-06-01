import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './UserPanel.module.css';

const UserPanel = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://bitirmeiys.enesozbuganli.com/api/UserDataList/Get?userID=1'); // userId'yi gerçek kullanıcı ID'si ile değiştirin
        if (!response.ok) {
          throw new Error('Kullanıcı verileri yüklenirken bir hata oluştu');
        }
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  if (loading) {
    return <div className={styles.loading}>Yükleniyor...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <h3>Toplam Randevu</h3>
          <p className={styles.statNumber}>{userData?.sumAppointments || 0}</p>
          <button onClick={() => navigate('/user-panel/appointments')}>
            Randevularımı Görüntüle
          </button>
        </div>

        <div className={styles.statCard}>
          <h3>Yaklaşan Randevu</h3>
          <p className={styles.statNumber}>{userData?.upcomingAppointmentsCount || 0}</p>
          <button onClick={() => navigate('/user-panel/appointments')}>
            Detayları Görüntüle
          </button>
        </div>

        <div className={styles.statCard}>
          <h3>Favori Doktorlar</h3>
          <p className={styles.statNumber}>0</p>
          <button onClick={() => navigate('/user-panel/doctors')}>
            Doktorları Görüntüle
          </button>
        </div>
      </div>

      <div className={styles.activitiesContainer}>
        <h2>Son Aktiviteler</h2>
        <div className={styles.activitiesList}>
          {userData?.last5Activities?.map((activity, index) => (
            <div key={index} className={styles.activityCard}>
              <div className={styles.activityHeader}>
                <span className={`${styles.activityType} ${styles[activity.activityType.toLowerCase()]}`}>
                  {activity.activityType}
                </span>
                <span className={styles.activityDate}>
                  {formatDate(activity.activityDate)}
                </span>
              </div>
              <p className={styles.activityDesc}>{activity.activityDesc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Hızlı İşlemler</h2>
        <div className={styles.actionButtons}>
          <button onClick={() => navigate('/user-panel/appointments/new')}>
            Yeni Randevu Al
          </button>
          <button onClick={() => navigate('/user-panel/profile')}>
            Profili Düzenle
          </button>
          <button onClick={() => navigate('/user-panel/doctors')}>
            Doktor Ara
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPanel; 