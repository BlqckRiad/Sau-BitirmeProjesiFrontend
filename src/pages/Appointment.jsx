import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets'
import styles from './Appointment.module.css'
import RelatedDoctors from '../components/RelatedDoctors'

const Appointment = () => {

  const {docId} = useParams()
  const {doctors, currencySymbol }= useContext(AppContext)
  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']


  const [docInfo, setDocInfo] = useState(null)
  const [docSlots, setDocSlots] = useState([])
  const [slotIndex, setSlotIndex] = useState(0)
  const [slotTime, setSlotTime] = useState('')

  const fetchDocInfo = async ()=> {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
    
  }

  const getAvailebleSlots = async ()=>{
    setDocSlots([])
    // Getting current date...
    let today = new Date()

    for(let i=0; i< 7; i++){

      // getting date with index...
      let currentDate = new Date(today)
      currentDate.setDate(today.getDate()+i)

      // Setting end time of the date with index...
      let endTime = new Date()
      endTime.setDate(today.getDate()+i)
      endTime.setHours(21,0,0,0)

      /// setting hours...
      if(today.getDate()=== currentDate.getDate()){
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() +1: 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0)
      }else{
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }

      let timeSlots =[]
      while(currentDate < endTime){
        let formattedTime = currentDate.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})

        // add slot to array...
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })

        /// Increment current time by 30 minutes...
        currentDate.setMinutes(currentDate.getMinutes() +30)
      }

      setDocSlots(prev => ([...prev, timeSlots]))
    }
  }

  useEffect(()=> {
    fetchDocInfo()
  }, [doctors, docId])

  useEffect(()=> {
    getAvailebleSlots()
  },[docInfo])


  useEffect(() =>{
    console.log(docSlots)
  },[docSlots])


  return docInfo && (
    <div className={styles.container}>
        {/*-----------------Doctor Details-----------------------*/}
        <div className={styles.doctorSection}>
          <div className={styles.imageWrapper}>
            <img src={docInfo.image} alt='' className={styles.doctorImage}/>
          </div>

          <div className={styles.infoSection}>
            {/* --------------------Doc Info : name, degree, experience ------------------*/}

            <p className={styles.doctorName}>
              {docInfo.name}
              <img src={assets.verified_icon} alt=''className={styles.verifiedIcon} />
            </p>

            <div className={styles.subInfo}>
              <p>{docInfo.degree} - {docInfo.speciality}</p>
              <button className={styles.experienceButton}>{docInfo.experience}</button>
            </div>

            {/* --------------------Doctors About ------------------*/}
            <div className={styles.aboutSection}>
              <p className={styles.aboutTitle}>
                About <img src={assets.info_icon} alt='' className={styles.infoIcon} />
              </p>
              <p className={styles.aboutText}>{docInfo.about}</p>
            </div>
            <p className={styles.fees}>
              Randevu ücreti: <span className={styles.feesValue}> {currencySymbol} {docInfo.fees}</span>
            </p>
          </div>
        </div>
        
        {/* -------------------- Booking slots------------------*/}

        <div className={styles.bookingSection}>
          <p className={styles.bookingTitle}>Rezervasıyon</p>  
          <div className={styles.dayList}>
            {
              docSlots.length && docSlots.map((item, index) => (
                <div className={`${styles.dayItem} ${slotIndex === index ? styles.activeDay : ''}`} onClick={() => setSlotIndex(index)} key={index}>
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))
            }
          </div>

          <div className={styles.slotList}>
            {docSlots.length && docSlots[slotIndex].map((item , index) => (
              <p key={index} className={styles.slotItem}>
                {
                  item.time.toLowerCase()
                }
              </p>
            ))}
          </div>

          <button className={styles.bookingbtn}> Rendevu al</button>
        </div>

        {/* -------------------- Listing Related Docrots.. ------------------*/}

        <RelatedDoctors docId={docId} speciality= {docInfo.speciality} />
    </div>
  )
}

export default Appointment