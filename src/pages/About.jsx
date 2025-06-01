import React from 'react';
import { assets } from '../assets/assets';
import styles from './About.module.css';

const About = () => {
  return (
    <div className={styles.container}>
      {/* Title Section */}
      <div className={styles.header}>
        <h2>
          Bizim <span>Hakkımızda</span>
        </h2>
      </div>

      {/* Image Section */}
      <div className={styles.imageContainer}>
        <img src={assets.about_image} alt='About Us' className={styles.image} />
      </div>

      {/* Content Section */}
      <div className={styles.content}>
        <p className={styles.welcome}> Hoş Geldiniz!</p>
        <p className={styles.description}>
          DentalCare Pro olarak, hastalarımıza en iyi hizmeti sunmak için buradayız. Modern teknolojiyi, uzman hekim kadromuzla buluşturarak sağlıklı ve estetik bir gülüş için çalışıyoruz.
        </p>
        <p className={styles.subTitle}> Neden Biz?</p>
        <ul className={styles.list}>
          <li>✓ Deneyimli ve güler yüzlü kadro</li>
          <li>✓ Modern klinik ortamı</li>
          <li>✓ Hızlı ve güvenilir randevu sistemi</li>
          <li>✓ Hasta memnuniyeti odaklı yaklaşım</li>
        </ul>
      </div>
    </div>
  );
};

export default About;
