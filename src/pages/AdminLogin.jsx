import React, { useState } from 'react';
import styles from './AdminLogin.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUserShield } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ emailOrTelNo: '', password: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    if (!formData.emailOrTelNo || !formData.password) {
      setError('Tüm alanları doldurun.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://example.com/Login/AdminLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Giriş başarısız.');
      }

      const data = await response.json();
      console.log('Admin data:', data);
      setAdminInfo(data);

      // Giriş başarılı...
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.adminLoginContainer}>
      <form className={styles.adminLoginForm} onSubmit={handleLogin}>
        <h2><FontAwesomeIcon icon={faUserShield} /> Admin Girişi</h2>

        <div className={`${styles.formGroup} ${styles.floating}`}>
          <FontAwesomeIcon icon={faEnvelope} className={styles.inputIcon} />
          <input
            type="text"
            name="emailOrTelNo"
            placeholder=" "
            value={formData.emailOrTelNo}
            onChange={handleChange}
            required
          />
          <label htmlFor="emailOrTelNo">E-posta veya Telefon</label>
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


        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.loginButton} disabled={isSubmitting}>
          {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
