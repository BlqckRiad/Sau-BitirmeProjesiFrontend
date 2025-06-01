import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './DoctorProfile.module.css';

const DoctorProfile = () => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Dosya boyutu kontrolü (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Dosya boyutu 5MB\'dan küçük olmalıdır.');
      return;
    }

    // Dosya tipi kontrolü
    if (!file.type.startsWith('image/')) {
      alert('Lütfen geçerli bir resim dosyası seçin.');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Resmi yükle
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await fetch('https://bitirmeiys.enesozbuganli.com/api/Image/AddImage', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('Resim yüklenirken bir hata oluştu');
      }

      const imageData = await uploadResponse.json();
      console.log('Image upload response:', imageData);

      // 2. Kullanıcı resmini güncelle
      const updateResponse = await fetch('https://bitirmeuser.enesozbuganli.com/api/UserUpdate/UserImageUpdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userID: user.userID,
          newImageID: imageData.imageID,
          newImageUrl: imageData.imageUrl,
          updatedUserID: user.userID
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Profil resmi güncellenirken bir hata oluştu');
      }

      // 3. LocalStorage'ı güncelle
      const updatedUser = {
        ...user,
        userImageUrl: imageData.imageUrl
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      // Sayfayı yenile
      window.location.reload();

      alert('Profil resmi başarıyla güncellendi!');
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
      alert('Resim yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileHeader}>
        <h1>Profil Fotoğrafı</h1>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.profileImage}>
          <img 
            src={user?.userImageUrl || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/150';
            }}
          />
          <div className={styles.imageUpload}>
            <input 
              type="file" 
              id="imageUpload" 
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            <label htmlFor="imageUpload">
              {isUploading ? 'Yükleniyor...' : 'Fotoğraf Değiştir'}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile; 