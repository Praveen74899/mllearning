import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMyContext } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const Login = () => {
  const { login } = useMyContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      toast.success('Login successful!');
      setFormData({ email: '', password: '' });
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message); // e.g. User not found
      } else {
        toast.error('Server not responding.');
      }
      console.error('Login error:', error);
    }
  };
  return (
    <div className="flex items-center justify-center mt-11">
      <form
        autoComplete="off"
        onSubmit={handleSubmit}
        className="max-w-md w-full text-center border border-gray-300 rounded-2xl px-8 py-10 bg-white shadow"
      >
        <h1 className="text-gray-900 text-3xl font-medium">Login</h1>
        <p className="text-gray-500 text-sm mt-2">Please sign in to continue</p>

        <div className="mt-8">
          <input
            type="email"
            name="email"
            placeholder="Email id"
            autoComplete="off"
            className="w-full h-12 px-4 border border-gray-300 rounded-full text-sm placeholder-gray-500 mb-4"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            autoComplete="new-password"
            className="w-full h-12 px-4 border border-gray-300 rounded-full text-sm placeholder-gray-500"
            required
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="text-left text-indigo-500 mt-3">
          <a className="text-sm" href="#">
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="mt-6 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition"
        >
          Login
        </button>

        <p className="text-gray-500 text-sm mt-4">
          Don’t have an account?{' '}
          <Link to="/register" className="text-indigo-500 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
