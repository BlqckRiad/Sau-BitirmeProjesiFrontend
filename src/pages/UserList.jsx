import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../api/userService';
import UserCard from '../components/UserCard';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers();
        setUsers(result);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsers();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Tüm Kullanıcılar</h2>
      {users.map(user => (
        <UserCard key={user.userID} user={user} />
      ))}
    </div>
  );
};

export default UserList;
