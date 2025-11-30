import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faPhone, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './Registration.module.css';

const Registration = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    surName: '',
    userName: '',
    userEmail: '',
    password: '',
    userTelNo: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('https://bitirmeuser.enesozbuganli.com/api/Register/UserRegister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kayıt işlemi başarısız oldu.');
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successContainer}>
        <h2>Kayıt Başarılı!</h2>
        <p>Hesabınız başarıyla oluşturuldu. Giriş sayfasına yönlendiriliyorsunuz...</p>
      </div>
    );
  }

  return (
    <div className={styles.registrationContainer}>
      <div className={styles.formHeader}>
        <div className={styles.logo}>
          <h2>Diş Tomografi Sistemi</h2>
        </div>
        <h3>Kayıt Ol</h3>
      </div>

      <form onSubmit={handleSubmit} className={styles.registrationForm}>
        <div className={`${styles.formGroup} ${styles.floating}`}>
          <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
          <input
            type="text"
            name="name"
            placeholder=" "
            value={formData.name}
            onChange={handleChange}
            maxLength={50}
            required
          />
          <label htmlFor="name">Ad</label>
        </div>

        <div className={`${styles.formGroup} ${styles.floating}`}>
          <FontAwesomeIcon icon={faUser} className={styles.inputIcon} />
          <input
            type="text"
            name="surName"
            placeholder=" "
            value={formData.surName}
            onChange={handleChange}
            maxLength={50}
            required
          />
          <label htmlFor="surName">Soyad</label>
        </div>

        <div className={`${styles.formGroup} ${styles.floating}`}>
          <FontAwesomeIcon icon={faUserCircle} className={styles.inputIcon} />
          <input
            type="text"
            name="userName"
            placeholder=" "
            value={formData.userName}
            onChange={handleChange}
            maxLength={40}
            required
          />
          <label htmlFor="userName">Kullanıcı Adı</label>
        </div>

        <div className={`${styles.formGroup} ${styles.floating}`}>
          <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
          <input
            type="email"
            name="userEmail"
            placeholder=" "
            value={formData.userEmail}
            onChange={handleChange}
            required
          />
          <label htmlFor="userEmail">E-posta</label>
        </div>

        <div className={`${styles.formGroup} ${styles.floating}`}>
          <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
          <input
            type="password"
            name="password"
            placeholder=" "
            value={formData.password}
            onChange={handleChange}
            minLength={6}
            maxLength={100}
            required
          />
          <label htmlFor="password">Şifre</label>
        </div>

        <div className={`${styles.formGroup} ${styles.floating}`}>
          <FontAwesomeIcon icon={faPhone} className={styles.inputIcon} />
          <input
            type="tel"
            name="userTelNo"
            placeholder=" "
            value={formData.userTelNo}
            onChange={handleChange}
          />
          <label htmlFor="userTelNo">Telefon Numarası (Opsiyonel)</label>
        </div>

        {error && <div className={`${styles.errorMessage} ${styles.animateShake}`}>{error}</div>}

        <div className={styles.formGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Kayıt Yapılıyor...' : 'Kayıt Ol'}
          </button>
        </div>

        <div className={styles.formFooter}>
          <p>
            Zaten hesabınız var mı?{' '}
            <a href="/login" onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}>
              Giriş Yap
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Registration;
