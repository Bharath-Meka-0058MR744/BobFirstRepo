import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Mock data since we don't have Node.js installed
    const mockUsers = {
      '1': { _id: '1', name: 'John Doe', email: 'john@example.com', createdAt: '2023-04-01T12:00:00Z' },
      '2': { _id: '2', name: 'Jane Smith', email: 'jane@example.com', createdAt: '2023-04-02T14:30:00Z' },
      '3': { _id: '3', name: 'Bob Johnson', email: 'bob@example.com', createdAt: '2023-04-03T09:15:00Z' }
    };
    
    // Simulate API call
    setTimeout(() => {
      if (mockUsers[id]) {
        setUser(mockUsers[id]);
      } else {
        setError('User not found');
      }
      setLoading(false);
    }, 500);
    
    // In a real app with Node.js installed, you would use:
    /*
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
    */
  }, [id]);

  if (loading) {
    return <div>Loading user details...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!user) {
    return <div className="alert alert-danger">User not found</div>;
  }

  return (
    <div className="user-details">
      <div className="card">
        <h1>{user.name}</h1>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>User ID:</strong> {user._id}</p>
        <p><strong>Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
        
        <div style={{ marginTop: '20px' }}>
          <Link to="/users" className="btn">
            Back to Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

// Made with Bob
