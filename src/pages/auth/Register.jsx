import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMyContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const { register,  } = useMyContext();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password.trim()) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
     const success = await register(formData.name, formData.email, formData.password);

      if (success) {
      toast.success('Registration successful');
      setFormData({ name: '', email: '', password: '' });
     navigate('/dashboard');
    }
    } catch (error) {
      console.error(error);
      toast.error('Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center mt-11">
      <form
        onSubmit={submitHandler}
        autoComplete="off"
        className="max-w-96 w-full text-center border border-gray-300/60 rounded-2xl px-8 bg-white"
      >
        <h1 className="text-gray-900 text-3xl mt-10 font-medium">Register</h1>
        <p className="text-gray-500 text-sm mt-2">Create a new account</p>

        {/* Name */}
        <div className="flex items-center w-full mt-10 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            autoComplete="name"
          />
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1 text-left">{errors.name}</p>}

        {/* Email */}
        <div className="flex items-center w-full mt-4 bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            autoComplete="email"
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1 text-left">{errors.email}</p>}

        {/* Password */}
        <div className="flex items-center mt-4 w-full bg-white border border-gray-300/80 h-12 rounded-full overflow-hidden pl-6 gap-2">
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="bg-transparent text-gray-500 placeholder-gray-500 outline-none text-sm w-full h-full"
            autoComplete="new-password"
          />
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1 text-left">{errors.password}</p>}

        <button
          type="submit"
          className="mt-6 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition-opacity"
        >
          Register
        </button>

        <p className="text-gray-500 text-sm mt-4 mb-10">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-500 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
