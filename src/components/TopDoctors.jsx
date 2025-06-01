import React, { useEffect, useState } from 'react'
import styles from './TopDoctor.module.css';
import { useNavigate } from 'react-router-dom';

const TopDoctors = () => {
    const navigate = useNavigate()
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://bitirmeuser.enesozbuganli.com/api/User/GetAllUsers');
                const data = await response.json();
                
                // Sadece doktorları filtrele
                const doctors = data.filter(user => user.userRoleID === 2);
                setDoctors(doctors);
            } catch (error) {
                console.error('Doktorlar yüklenemedi:', error);
                setDoctors([]);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className={styles.topDoctorsContainer}>
            <h1 className={styles.topDoctorsTitle}>En iyi doktorlarımız </h1>
            <p className={styles.topDoctorsSubtitle}>Uzman ve güvenilir doktoları kolayca keşfedin.</p>

            <div className={styles.doctorsGrid}>
                {doctors.slice(0, 10).map((item, index) => (
                    <div onClick={() => {navigate(`/appointment/${item.userID}`); scrollTo(0,0)}} key={index} className={styles.doctorCard}>
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
                            <div className={styles.doctorStatus}>
                                <span className={styles.statusDot}></span>
                                <p></p><p className={styles.statusText}>Mevcut</p>
                            </div>
                            <p className={styles.doctorName}>{item.name} {item.surName}</p>
                            <p className={styles.doctorSpeciality}>{item.speciality}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.moreButtonWrapper}>
                <button onClick={()=>{navigate('/doctors'); scrollTo(0,0)}} className={styles.moreButton}>Daha Fazla</button>
            </div>
        </div>
    )
}

export default TopDoctors