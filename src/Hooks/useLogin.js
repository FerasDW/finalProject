import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../../Context/AuthContext';

// Use the correct base URL for edusphere-service (port 8082)
const API_BASE_URL = 'http://13.61.114.153:8082/api';
const LOGIN_URL = `${API_BASE_URL}/login`;
const USER_URL = `${API_BASE_URL}/auth/user`;

// Helper function to get token from localStorage
const getToken = () => {
    return localStorage.getItem("jwtToken");
};

export const useLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChanges = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(LOGIN_URL, formData);
      const token = response.data.token;
      
      // Store the token in local storage
      localStorage.setItem("jwtToken", token);

      // Now fetch user data with the new token
      const userResponse = await axios.get(USER_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      loginUser(userResponse.data);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login Error:', err);
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  return {
    formData,
    error,
    loading,
    handleChanges,
    handleLogin,
  };
};