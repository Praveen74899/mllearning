// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useMyContext } from '../../contexts/AuthContext';
// import { toast } from 'react-hot-toast';

// const Login = () => {
//   const { login } = useMyContext();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await login(formData.email, formData.password);
//       toast.success('Login successful!');
//       setFormData({ email: '', password: '' });
//       navigate('/dashboard');
//     } catch (error) {
//       if (error.response?.data?.message) {
//         toast.error(error.response.data.message); // e.g. User not found
//       } else {
//         toast.error('Server not responding.');
//       }
//       console.error('Login error:', error);
//     }
//   };
//   return (
//     <div className="flex items-center justify-center mt-11">
//       <form
//         autoComplete="off"
//         onSubmit={handleSubmit}
//         className="max-w-md w-full text-center border border-gray-300 rounded-2xl px-8 py-10 bg-white shadow"
//       >
//         <h1 className="text-gray-900 text-3xl font-medium">Login</h1>
//         <p className="text-gray-500 text-sm mt-2">Please sign in to continue</p>

//         <div className="mt-8">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email id"
//             autoComplete="off"
//             className="w-full h-12 px-4 border border-gray-300 rounded-full text-sm placeholder-gray-500 mb-4"
//             required
//             value={formData.email}
//             onChange={handleChange}
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             autoComplete="new-password"
//             className="w-full h-12 px-4 border border-gray-300 rounded-full text-sm placeholder-gray-500"
//             required
//             value={formData.password}
//             onChange={handleChange}
//           />
//         </div>

//         <div className="text-left text-indigo-500 mt-3">
//           <a className="text-sm" href="#">
//             Forgot password?
//           </a>
//         </div>

//         <button
//           type="submit"
//           className="mt-6 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90 transition"
//         >
//           Login
//         </button>

//         <p className="text-gray-500 text-sm mt-4">
//           Don’t have an account?{' '}
//           <Link to="/register" className="text-indigo-500 hover:underline">
//             Sign up
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Login;

import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Flex } from 'antd';
import { useMyContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import {useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useMyContext();
    const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async values => {
    console.log('Received values of form: ', values);
    try {
      const success = await login(values.email, values.password);
      if (success) {
        toast.success('successful login');
        form.resetFields();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error(error);
      toast.error('login failed');
    }

  };
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-gray-900 text-3xl font-semibold text-center">Login</h1>
        <p className="text-gray-500 text-sm mb-6 text-center">Login Account </p>
        <Form
          name="login"
          style={{ maxWidth: 360 }}
          onFinish={onFinish}
          className=''
          form={form}
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please input your Password!' }]}
          >
            <Input prefix={<LockOutlined />} type="password" placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Flex justify="space-between" align="center">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
             <Link className='underline' to="/forgetpassword">Forget Password</Link>
            </Flex>
          </Form.Item>

          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Log in
            </Button>
            or <a className='underline' href="Register">Register now!</a>
          </Form.Item>
        </Form>
      </div>
    </div>
  );

};
export default Login;