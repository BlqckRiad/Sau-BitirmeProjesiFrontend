import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('Stored user data:', parsedUser);
      setUser(parsedUser);
    }
    setLoading(false);
  }, []);

  const login = async (emailOrTelNo, password) => {
    try {
      const response = await fetch('https://bitirmeuser.enesozbuganli.com/api/Login/UserLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrTelNo, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Giriş başarısız oldu.');
      }

      const userData = await response.json();
      console.log('Login response data:', userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch('https://bitirmeuser.enesozbuganli.com/api/Register/UserRegister', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kayıt işlemi başarısız oldu.');
      }

      const responseData = await response.json();
      console.log('Register response data:', responseData);
      localStorage.setItem('user', JSON.stringify(responseData));
      setUser(responseData);
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 