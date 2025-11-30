import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import styles from './Login.module.css';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        setError(result.error || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className={styles.successContainer}>
        <h2>Hoş Geldiniz!</h2>
        <p>Başarıyla giriş yaptınız.</p>
        <button
          className={styles.backButton}
          onClick={() => {
            setSuccess(false);
            setFormData({ email: '', password: '' });
          }}
        >
          Çıkış Yap
        </button>
      </div>
    );
  }

  return (
    <div className={styles.registrationContainer}>
      <div className={styles.formHeader}>
        <div className={styles.logo}>
          <h2>Diş Tomografi Sistemi</h2>
        </div>
        <h3>Giriş</h3>
      </div>

      <form onSubmit={handleLogin} className={styles.registrationForm}>
        <div className={`${styles.formGroup} ${styles.floating}`}>
          <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
          <input
            type="email"
            name="email"
            placeholder=" "
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label htmlFor="email">E-posta</label>
        </div>

        <div className={`${styles.formGroup} ${styles.floating}`}>
          <FontAwesomeIcon icon={faLock} className={styles.inputIcon} />
          <input
            type="password"
            name="password"
            placeholder=" "
            value={formData.password}
            onChange={handleChange}
            required
          />
          <label htmlFor="password">Şifre</label>
        </div>

        {error && <div className={`${styles.errorMessage} ${styles.animateShake}`}>{error}</div>}

        <div className={styles.formGroup}>
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </div>

        <div className={styles.formFooter}>
          <p>
            Hesabınız yok mu?{' '}
            <a href="/registration" onClick={(e) => {
              e.preventDefault();
              navigate('/registration');
            }}>
              Kayıt Ol
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
