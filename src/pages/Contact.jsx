import React, { useState } from 'react';
import styles from './Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const contactData = {
        contactUserEmail: formData.email,
        contactUserName: `${formData.firstName} ${formData.lastName}`,
        subject: formData.subject,
        message: formData.message
      };

      const response = await fetch('https://bitirmeiys.enesozbuganli.com/api/Contact/AddContact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData)
      });

      if (!response.ok) {
        throw new Error('Mesajınız gönderilirken bir hata oluştu');
      }

      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.contactContainer}>
      <div className={styles.contactWrapper}>
        <div className={styles.contactContent}>
          <h1 className={styles.title}>İletişim</h1>
          <p className={styles.description}>
            Sorularınız, önerileriniz veya geri bildirimleriniz için bizimle iletişime geçebilirsiniz.
          </p>

          {error && <div className={styles.error}>{error}</div>}
          {success && (
            <div className={styles.success}>
              Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
            </div>
          )}

          <form className={styles.contactForm} onSubmit={handleSubmit}>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName">Ad</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="Adınız"
                  disabled={loading}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="lastName">Soyad</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Soyadınız"
                  disabled={loading}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">E-posta</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="ornek@email.com"
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subject">Konu</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                placeholder="Mesajınızın konusu"
                disabled={loading}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="message">Mesaj</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Mesajınızı buraya yazın..."
                rows="6"
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Gönderiliyor...' : 'Gönder'}
            </button>
          </form>
        </div>

        <div className={styles.contactInfo}>
          <div className={styles.infoCard}>
            <h2>İletişim Bilgileri</h2>
            <div className={styles.infoItem}>
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h3>Adres</h3>
                <p>Sakarya Üniversitesi, Esentepe Kampüsü<br />Serdivan, Sakarya</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <i className="fas fa-phone"></i>
              <div>
                <h3>Telefon</h3>
                <p>+90 (264) 295 50 00</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <i className="fas fa-envelope"></i>
              <div>
                <h3>E-posta</h3>
                <p>info@dentalcarepro.com</p>
              </div>
            </div>
          </div>

          <div className={styles.mapContainer}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3036.0024907120455!2d30.3273!3d40.7567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14ccd1e3c5c5c5c5%3A0x5c5c5c5c5c5c5c5c!2sSakarya%20%C3%9Cniversitesi!5e0!3m2!1str!2str!4v1620000000000!5m2!1str!2str"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Sakarya Üniversitesi Haritası"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
