import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Anavbar from './Anavbar';
import Footer from '../Components/Footer';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }
      try {
        const res = await axios.get(window.BACKEND_URL + '/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Anavbar />
      <main className="container animate-fade" style={{ flexGrow: 1, padding: '2rem 1.5rem' }}>
        <h1 style={{ marginBottom: '1.5rem', fontSize: '1.8rem', fontWeight: 600 }}>Customer Registry</h1>
        
        {loading ? (
          <h3>Loading registered customers...</h3>
        ) : users.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No customers registered yet.</p>
        ) : (
          <div className="glass-card" style={{ overflowX: 'auto', padding: 0 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '500px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  <th style={{ padding: '1rem 1.5rem' }}>Customer Name</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Email Address</th>
                  <th style={{ padding: '1rem 1.5rem' }}>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)', fontSize: '0.95rem' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{user.name}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>
                      {new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Users;
