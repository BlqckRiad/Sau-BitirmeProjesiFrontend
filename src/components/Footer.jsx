import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>Dental Care Pro</h3>
          <p>
            Sağlıklı gülüşler için profesyonel diş sağlığı hizmetleri sunuyoruz.
            Modern teknoloji ve uzman kadromuzla yanınızdayız.
          </p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink}>
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className={styles.socialLink}>
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className={styles.socialLink}>
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className={styles.socialLink}>
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>Hızlı Bağlantılar</h3>
          <ul className={styles.footerLinks}>
            <li><a href="/">Ana Sayfa</a></li>
            <li><a href="/about">Hakkımızda</a></li>
            <li><a href="/services">Hizmetlerimiz</a></li>
            <li><a href="/doctors">Doktorlarımız</a></li>
            <li><a href="/contact">İletişim</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>Hizmetlerimiz</h3>
          <ul className={styles.footerLinks}>
            <li><a href="/services/dental-implant">Diş İmplantı</a></li>
            <li><a href="/services/orthodontics">Ortodonti</a></li>
            <li><a href="/services/cosmetic-dentistry">Kozmetik Diş Hekimliği</a></li>
            <li><a href="/services/root-canal">Kanal Tedavisi</a></li>
            <li><a href="/services/teeth-whitening">Diş Beyazlatma</a></li>
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>İletişim Bilgileri</h3>
          <ul className={styles.contactInfo}>
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <span>Sakarya Üniversitesi, Esentepe Kampüsü, Serdivan, Sakarya</span>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <span>+90 (264) 295 50 00</span>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <span>info@dentalcarepro.com</span>
            </li>
            <li>
              <i className="fas fa-clock"></i>
              <span>Pazartesi - Cumartesi: 09:00 - 18:00</span>
            </li>
          </ul>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.footerBottomContent}>
          <p>&copy; 2024 Dental Care Pro. Tüm hakları saklıdır.</p>
          <div className={styles.footerBottomLinks}>
            <a href="/privacy">Gizlilik Politikası</a>
            <a href="/terms">Kullanım Şartları</a>
            <a href="/cookies">Çerez Politikası</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
