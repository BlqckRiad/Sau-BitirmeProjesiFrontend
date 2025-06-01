import React from 'react';
import styles from './UserCard.module.css';

const UserCard = ({ user }) => {
  return (
    <div className={styles.card}>
      <img src={user.userImageUrl} alt="profil" className={styles.image} />
      <div className={styles.info}>
        <h3>{user.name} {user.surName}</h3>
        <p><strong>Kullanıcı Adı:</strong> {user.userName}</p>
        <p><strong>E-posta:</strong> {user.userEmail}</p>
        <p><strong>Telefon:</strong> {user.userTelNo}</p>
        <p><strong>Rol:</strong> {user.userRoleID === 1 ? 'Admin' : 'Kullanıcı'}</p>
        <p><strong>Durum:</strong> {user.isUserOnline ? ' Online' : ' Offline'}</p>
      </div>
    </div>
  );
};

export default UserCard;
