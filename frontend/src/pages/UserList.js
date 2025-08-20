import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This would normally fetch from the API
    // Since we don't have Node.js installed, we'll use mock data
    const mockUsers = [
      { _id: '1', name: 'John Doe', email: 'john@example.com' },
      { _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
      { _id: '3', name: 'Bob Johnson', email: 'bob@example.com' }
    ];
    
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
    
    // In a real app with Node.js installed, you would use:
    /*
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
    */
  }, []);

  if (loading) {
    return <div>Loading users...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="user-list">
      <h1>Users</h1>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div>
          {users.map(user => (
            <div key={user._id} className="card">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
              <Link to={`/users/${user._id}`} className="btn">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserList;

// Made with Bob
