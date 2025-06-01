import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';
import Beyin from '../assets/Beyin.png'
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    console.log('User object:', user);
    if (user) {
      console.log('User roleId:', user.userRoleID);
      const roleId = user.userRoleID;
      setUserRole(roleId);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setUserRole(null);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const renderPanelLink = () => {
    console.log('Current userRole:', userRole);
    if (!user) return null;

    if (userRole === 1) {
      return (
        <li>
          <NavLink to="/user-panel" className={styles.navItem} onClick={closeMenu}>Hasta Paneli</NavLink>
          <hr />
        </li>
      );
    } else if (userRole === 2) {
      return (
        <li>
          <NavLink to="/doctor-panel" className={styles.navItem} onClick={closeMenu}>Doktor Paneli</NavLink>
          <hr />
        </li>
      );
    }
    return null;
  };

  return (
    <div className={styles.navbar}>
      {/* Logo Section */}
      <div className={styles.logo}>
        <img onClick={() => { navigate('/'); closeMenu(); }} src={Beyin} alt='Beyin' />
        <a href='#'> Randevu Alma Sistemi </a>
      </div>

      {/* Hamburger Menu */}
      <div className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navigation Links */}
      <ul className={`${styles.navlist} ${isMenuOpen ? styles.active : ''}`}>
        <li>
          <NavLink to="/" className={styles.navItem} onClick={closeMenu}>Ana Sayfa</NavLink>
          <hr />
        </li>
        <li>
          <NavLink to="/doctors" className={styles.navItem} onClick={closeMenu}>Tüm Doktorlar</NavLink>
          <hr />
        </li>
        <li>
          <NavLink to="/about" className={styles.navItem} onClick={closeMenu}>Hakkında</NavLink>
          <hr />
        </li>
        <li>
          <NavLink to="/contact" className={styles.navItem} onClick={closeMenu}>İletişim</NavLink>
          <hr />
        </li>

        {!user ? (
          <>
            <li>
              <NavLink to="/Registration" className={styles.navItem} onClick={closeMenu}>Kayıt Ol</NavLink>
              <hr />
            </li>
            <li>
              <NavLink to="/login" className={styles.navItem} onClick={closeMenu}>Giriş Yap</NavLink>
              <hr />
            </li>
          </>
        ) : (
          <>
            {renderPanelLink()}
            <li>
              <button onClick={handleLogout} className={styles.logoutButton}>Çıkış Yap</button>
              <hr />
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
