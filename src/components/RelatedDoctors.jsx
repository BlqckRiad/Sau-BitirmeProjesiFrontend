import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import styles from './RelatedDoctors.module.css'

const RelatedDoctors = ({ speciality, docId }) => {
    const { doctors } = useContext(AppContext)
    const navigate = useNavigate()

    const [relDoc, setRelDocs] = useState([])

    useEffect(() => {
        if (doctors.length > 0 && speciality) {
            const doctorsData = doctors.filter((doc) => doc.speciality === speciality && doc._id !== docId)
            setRelDocs(doctorsData)
        }
    }, [doctors, speciality, docId])

    return (
        <div className={styles.topDoctorsContainer}>
            <h1 className={styles.topDoctorsTitle}>En iyi doktorlarımız </h1>
            <p className={styles.topDoctorsSubtitle}>Uzman ve güvenilir doktoları kolayca keşfedin.</p>

            <div className={styles.doctorsGrid}>
                {relDoc.slice(0, 5).map((item, index) => (
                    <div onClick={() => {navigate(`/appointment/${item._id}`); scrollTo(0,0)}} key={index} className={styles.doctorCard}>
                        <img src={item.image} alt='' className={styles.doctorImage} />
                        <div className={styles.doctorInfo}>
                            <div className={styles.doctorStatus}>
                                <span className={styles.statusDot}></span>
                                <p></p><p className={styles.statusText}>Mevcut</p>
                            </div>
                            <p className={styles.doctorName}>{item.name}</p>
                            <p className={styles.doctorSpeciality}>{item.speciality}</p>
                        </div>

                    </div>
                ))}
            </div>

            <div className={styles.moreButtonWrapper}>
                <button onClick={() => { navigate('/doctors'); scrollTo(0, 0) }} className={styles.moreButton}>Daha Fazla</button>
            </div>
        </div>
    )
}

export default RelatedDoctors