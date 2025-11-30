import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './DoctorTomographyUpload.module.css';

const DoctorTomographyUpload = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [xrayResult, setXrayResult] = useState(null);

  // URL'den hasta bilgilerini al
  const patientId = new URLSearchParams(location.search).get('patientId');
  const patientName = new URLSearchParams(location.search).get('patientName');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Lütfen bir Diş görüntüsü seçin');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Önce Image API'sine yükle
      const formData = new FormData();
      formData.append('file', selectedFile);

      const imageResponse = await fetch('https://bitirmeiys.enesozbuganli.com/api/Image/AddImage', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!imageResponse.ok) {
        throw new Error('Görüntü yüklenirken bir hata oluştu');
      }

      const imageData = await imageResponse.json();

      // 2. Prediction API'sine istek at
      const predictResponse = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url: imageData.imageUrl
        })
      });

      if (!predictResponse.ok) {
        throw new Error('Prediction işlemi sırasında bir hata oluştu');
      }

      const predictData = await predictResponse.json();

      // 3. XRay sonucunu kaydet (LastDisResult endpoint'ine)
      const xrayResponse = await fetch('https://bitirmeiys.enesozbuganli.com/api/XRayResult/LastDisResult', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userID: parseInt(patientId),
          doctorID: user.userID,
          xRayNormalImageID: imageData.imageID,
          xRayNormalImageUrl: predictData.ImageUrl,
          xRayTitle: predictData.ImageUrl,
          xRayDescription: predictData.prediction
        })
      });

      if (!xrayResponse.ok) {
        throw new Error('Diş sonucu kaydedilirken bir hata oluştu');
      }

      const xrayData = await xrayResponse.json();
      setXrayResult(xrayData);
      setUploadSuccess(true);

    } catch (error) {
      console.error('Yükleme hatası:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Diş görüntüsü yükleniyor ve analiz ediliyor, lütfen bekleyin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Tekrar Dene</button>
      </div>
    );
  }

  if (uploadSuccess && xrayResult) {
    return (
      <div className={styles.resultContainer}>
        <h2>Diş Sonucu Başarıyla Kaydedildi</h2>
        <div className={styles.resultDetails}>
          <p><strong>Hasta:</strong> {patientName}</p>
          <p><strong>Doktor:</strong> Dr. {user.name} {user.surName}</p>
          <p><strong>Kayıt Tarihi:</strong> {new Date(xrayResult.createdDate).toLocaleString('tr-TR')}</p>
          <p><strong>Diş ID:</strong> {xrayResult.xRayResultID}</p>
          <div className={styles.diagnosisSection}>
            <h3>Teşhis Sonuçları</h3>
            <p><strong>Başlık:</strong> {xrayResult.xRayTitle}</p>
            <p><strong>Açıklama:</strong> {xrayResult.xRayDescription}</p>
          </div>
          <img src={xrayResult.xRayNormalImageUrl} alt="Tomografi Görüntüsü" className={styles.resultImage} />
        </div>
        <button onClick={() => navigate('/doctor-panel/tomography')}>Diş Listesine Dön</button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Diş Görüntüsü Yükle</h1>
        <p>Hasta: {patientName}</p>
      </div>

      <div className={styles.uploadSection}>
        <div className={styles.fileInput}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            id="tomography-upload"
          />
          <label htmlFor="tomography-upload">
            {selectedFile ? 'Dosya Seçildi' : 'Diş Görüntüsü Seç'}
          </label>
        </div>

        {previewUrl && (
          <div className={styles.preview}>
            <img src={previewUrl} alt="Önizleme" />
          </div>
        )}

        <button 
          className={styles.uploadButton}
          onClick={handleUpload}
          disabled={!selectedFile}
        >
          Yükle
        </button>
      </div>
    </div>
  );
};

export default DoctorTomographyUpload; 