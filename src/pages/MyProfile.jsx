import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './MyProfile.module.css';

const MyProfile = () => {
  const { userDetails } = useOutletContext();
  const { user } = useAuth();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    surName: '',
    userName: '',
    userEmail: '',
    userSexsID: '',
    userDate: '',
    userImageUrl: ''
  });

  const [securityData, setSecurityData] = useState({
    newEmail: '',
    newTelNo: ''
  });

  const [updateStatus, setUpdateStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const [emailUpdateStatus, setEmailUpdateStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const [telNoUpdateStatus, setTelNoUpdateStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  const [imageUpdateStatus, setImageUpdateStatus] = useState({
    loading: false,
    success: false,
    error: null
  });

  useEffect(() => {
    if (userDetails) {
      // Tarih formatını düzelt
      const formatDate = (dateString) => {
        if (!dateString || dateString === "0001-01-01T00:00:00") {
          return '';
        }
        try {
          const date = new Date(dateString);
          return date.toISOString().split('T')[0];
        } catch (error) {
          console.error('Tarih formatı hatası:', error);
          return '';
        }
      };

      setFormData({
        name: userDetails.name || '',
        surName: userDetails.surName || '',
        userName: userDetails.userName || '',
        userEmail: userDetails.userEmail || '',
        userSexsID: userDetails.userSexsID || '',
        userDate: formatDate(userDetails.userDate),
        userImageUrl: userDetails.userImageUrl || ''
      });
    }
  }, [userDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurityData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya boyutu kontrolü (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setImageUpdateStatus({
        loading: false,
        success: false,
        error: 'Dosya boyutu 5MB\'dan küçük olmalıdır'
      });
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      setImageUpdateStatus({
        loading: false,
        success: false,
        error: 'Lütfen geçerli bir resim dosyası seçin'
      });
      return;
    }

    setImageUpdateStatus({ loading: true, success: false, error: null });

    try {
      // 1. Adım: Resmi yükle
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('https://bitirmeiys.enesozbuganli.com/api/Image/AddImage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Resim yükleme başarısız oldu');
      }

      const uploadResult = await uploadResponse.json();
      console.log('Resim yükleme sonucu:', uploadResult);

      // 2. Adım: Kullanıcı profilini güncelle
      const updateData = {
        userID: parseInt(user.userID),
        newImageID: parseInt(uploadResult.imageID),
        newImageUrl: uploadResult.imageUrl,
        updatedUserID: parseInt(user.userID)
      };

      console.log('Güncelleme isteği verisi:', updateData);

      const updateResponse = await fetch('https://bitirmeuser.enesozbuganli.com/api/UserUpdate/UserImageUpdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!updateResponse.ok) {
        const errorData = await updateResponse.json().catch(() => ({}));
        console.error('API Hata Detayı:', errorData);
        throw new Error(errorData.message || 'Profil resmi güncellenemedi');
      }

      // LocalStorage'ı güncelle
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = {
        ...storedUser,
        userImageUrl: uploadResult.ImageUrl
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Form state'ini güncelle
      setFormData(prev => ({
        ...prev,
        userImageUrl: uploadResult.ImageUrl
      }));

      setImageUpdateStatus({
        loading: false,
        success: true,
        error: null
      });

      // 3 saniye sonra success mesajını kaldır
      setTimeout(() => {
        setImageUpdateStatus(prev => ({ ...prev, success: false }));
      }, 3000);

    } catch (error) {
      console.error('Hata detayı:', error);
      setImageUpdateStatus({
        loading: false,
        success: false,
        error: error.message
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdateStatus({ loading: true, success: false, error: null });

    try {
      // Tarih formatını kontrol et
      if (!formData.userDate) {
        throw new Error('Lütfen geçerli bir doğum tarihi girin');
      }

      const updateData = {
        userID: user.userID,
        name: formData.name,
        surName: formData.surName,
        userName: formData.userName,
        userDate: formData.userDate,
        userSexsID: parseInt(formData.userSexsID),
        updatedUserID: user.userID
      };

      const response = await fetch('https://bitirmeuser.enesozbuganli.com/api/UserUpdate/UserUpdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Güncelleme işlemi başarısız oldu');
      }

      // LocalStorage'daki kullanıcı bilgilerini güncelle
      const storedUser = JSON.parse(localStorage.getItem('user'));
      const updatedUser = {
        ...storedUser,
        name: formData.name,
        surName: formData.surName,
        userName: formData.userName
      };
      
      // LocalStorage'ı güncelle
      localStorage.setItem('user', JSON.stringify(updatedUser));

      setUpdateStatus({ loading: false, success: true, error: null });
      
      // 3 saniye sonra success mesajını kaldır
      setTimeout(() => {
        setUpdateStatus(prev => ({ ...prev, success: false }));
      }, 3000);

    } catch (error) {
      setUpdateStatus({
        loading: false,
        success: false,
        error: error.message
      });
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setEmailUpdateStatus({ loading: true, success: false, error: null });

    try {
      // E-posta değişikliği varsa
      if (securityData.newEmail && securityData.newEmail !== userDetails.userEmail) {
        const emailUpdateData = {
          userID: parseInt(user.userID),
          newEmail: securityData.newEmail,
          updatedUserID: parseInt(user.userID)
        };

        const emailResponse = await fetch('https://bitirmeuser.enesozbuganli.com/api/UserUpdate/UserEmailUpdate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(emailUpdateData)
        });

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json().catch(() => ({}));
          if (emailResponse.status === 400) {
            throw new Error('Geçersiz email adresi veya kullanıcı bulunamadı');
          }
          throw new Error(errorData.message || 'E-posta güncellenemedi');
        }

        // LocalStorage'daki kullanıcı bilgilerini güncelle
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = {
          ...storedUser,
          userEmail: securityData.newEmail
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Formu temizle
        setSecurityData(prev => ({
          ...prev,
          newEmail: ''
        }));

        setEmailUpdateStatus({ loading: false, success: true, error: null });
      }

      // 3 saniye sonra success mesajını kaldır
      setTimeout(() => {
        setEmailUpdateStatus(prev => ({ ...prev, success: false }));
      }, 3000);

    } catch (error) {
      console.error('Email güncelleme hatası:', error);
      setEmailUpdateStatus({
        loading: false,
        success: false,
        error: error.message
      });
    }
  };

  const handleTelNoSubmit = async (e) => {
    e.preventDefault();
    setTelNoUpdateStatus({ loading: true, success: false, error: null });

    try {
      if (securityData.newTelNo && securityData.newTelNo !== userDetails.userTelNo) {
        const telNoUpdateData = {
          userID: parseInt(user.userID),
          newTelNo: securityData.newTelNo.toString(),
          updatedUserID: parseInt(user.userID)
        };

        const telNoResponse = await fetch('https://bitirmeuser.enesozbuganli.com/api/UserUpdate/UserTelNoUpdate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
          body: JSON.stringify(telNoUpdateData)
        });

        if (!telNoResponse.ok) {
          const errorData = await telNoResponse.json().catch(() => ({}));
          if (telNoResponse.status === 400) {
            throw new Error('Geçersiz telefon numarası veya kullanıcı bulunamadı');
          }
          throw new Error(errorData.message || 'Telefon numarası güncellenemedi');
        }

        // LocalStorage'daki kullanıcı bilgilerini güncelle
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = {
          ...storedUser,
          userTelNo: securityData.newTelNo
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));

        // Formu temizle
        setSecurityData(prev => ({
          ...prev,
          newTelNo: ''
        }));

        setTelNoUpdateStatus({ loading: false, success: true, error: null });
      }

      // 3 saniye sonra success mesajını kaldır
      setTimeout(() => {
        setTelNoUpdateStatus(prev => ({ ...prev, success: false }));
      }, 3000);

    } catch (error) {
      console.error('Telefon numarası güncelleme hatası:', error);
      setTelNoUpdateStatus({
        loading: false,
        success: false,
        error: error.message
      });
    }
  };

  if (!userDetails) return null;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <h1>Profil Bilgilerim</h1>
        <p>Kişisel bilgilerinizi görüntüleyebilir ve güncelleyebilirsiniz.</p>
      </div>

      {updateStatus.success && (
        <div className={styles.successMessage}>
          Profil bilgileriniz başarıyla güncellendi!
        </div>
      )}

      {updateStatus.error && (
        <div className={styles.errorMessage}>
          {updateStatus.error}
        </div>
      )}

      {imageUpdateStatus.success && (
        <div className={styles.successMessage}>
          Profil fotoğrafınız başarıyla güncellendi!
        </div>
      )}

      {imageUpdateStatus.error && (
        <div className={styles.errorMessage}>
          {imageUpdateStatus.error}
        </div>
      )}

      <div className={styles.profileContent}>
        <div className={styles.profileImageContainer}>
          <img
            src={formData.userImageUrl || '/default-avatar.png'}
            alt="Profil"
            className={styles.profileImage}
            onClick={handleImageClick}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: 'none' }}
            accept="image/*"
          />
          {imageUpdateStatus.loading && <div className={styles.loading}>Yükleniyor...</div>}
          {imageUpdateStatus.success && <div className={styles.success}>Resim başarıyla güncellendi!</div>}
          {imageUpdateStatus.error && <div className={styles.error}>{imageUpdateStatus.error}</div>}
        </div>

        <form onSubmit={handleSubmit} className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label>Ad</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Soyad</label>
            <input
              type="text"
              name="surName"
              value={formData.surName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Kullanıcı Adı</label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label>Cinsiyet</label>
            <select
              name="userSexsID"
              value={formData.userSexsID}
              onChange={handleInputChange}
              required
            >
              <option value="">Seçiniz</option>
              <option value="1">Erkek</option>
              <option value="2">Kadın</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Doğum Tarihi</label>
            <input
              type="date"
              name="userDate"
              value={formData.userDate}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton} disabled={updateStatus.loading}>
            {updateStatus.loading ? 'Güncelleniyor...' : 'Profili Güncelle'}
          </button>
          {updateStatus.success && <div className={styles.success}>Profil başarıyla güncellendi!</div>}
          {updateStatus.error && <div className={styles.error}>{updateStatus.error}</div>}
        </form>

        <div className={styles.emailUpdateForm}>
          <h3>E-posta Güncelleme</h3>
          <form onSubmit={handleEmailSubmit} className={styles.securityForm}>
            <div className={styles.formGroup}>
              <label>Mevcut E-posta</label>
              <input
                type="email"
                value={userDetails.userEmail}
                disabled
                className={styles.disabledInput}
              />
              {userDetails.userEmailChecked && (
                <small className={styles.verifiedText}>✓ E-posta doğrulanmış</small>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Yeni E-posta</label>
              <input
                type="email"
                name="newEmail"
                value={securityData.newEmail}
                onChange={handleSecurityChange}
                required
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={emailUpdateStatus.loading}>
              {emailUpdateStatus.loading ? 'Güncelleniyor...' : 'E-posta Güncelle'}
            </button>
            {emailUpdateStatus.success && <div className={styles.success}>E-posta başarıyla güncellendi!</div>}
            {emailUpdateStatus.error && <div className={styles.error}>{emailUpdateStatus.error}</div>}
          </form>
        </div>

        <div className={styles.telNoUpdateForm}>
          <h3>Telefon Numarası Güncelleme</h3>
          <form onSubmit={handleTelNoSubmit} className={styles.securityForm}>
            <div className={styles.formGroup}>
              <label>Mevcut Telefon Numarası</label>
              <input
                type="tel"
                value={userDetails.userTelNo || 'Telefon numarası yok'}
                disabled
                className={styles.disabledInput}
              />
              {userDetails.userTelNoChecked && (
                <small className={styles.verifiedText}>✓ Telefon doğrulanmış</small>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>Yeni Telefon Numarası</label>
              <input
                type="tel"
                name="newTelNo"
                value={securityData.newTelNo}
                onChange={handleSecurityChange}
                placeholder="5XX XXX XX XX"
                required
              />
            </div>
            <button type="submit" className={styles.submitButton} disabled={telNoUpdateStatus.loading}>
              {telNoUpdateStatus.loading ? 'Güncelleniyor...' : 'Telefon Numarasını Güncelle'}
            </button>
            {telNoUpdateStatus.success && <div className={styles.success}>Telefon numarası başarıyla güncellendi!</div>}
            {telNoUpdateStatus.error && <div className={styles.error}>{telNoUpdateStatus.error}</div>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;




