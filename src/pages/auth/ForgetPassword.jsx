import React from 'react';
import { Button, Form, Input, message } from 'antd';
import url from '../../services/url';



const onFinish = async values => {
  try{
      const res = await url.post('/api/forgot-password',
        { email: values.email },
        { headers: { 'Content-Type': 'application/json' }});
        message.success("Reset link sent to your email!"); 
  }catch(error){
     message.error("Something went wrong. Try again!"); 
    console.error(error);
    
  }
};

const ForgetPassword = () => (
  <div className="flex h-screen items-center justify-center bg-gray-100">
    <Form
      layout="vertical"
      name="forget-password"
      onFinish={onFinish}
      style={{ width: 300 }}
      className="shadow-lg p-6 bg-white rounded-md border border-purple-400"
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[{ type: 'email', required: true, message: 'Please enter a valid email!' }]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Submit
        </Button>
      </Form.Item>
    </Form>
  </div>
);

export default ForgetPassword;
