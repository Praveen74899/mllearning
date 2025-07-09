import React, { useState } from "react";
import { useParams } from "react-router-dom";
import url from '../../services/url'; 
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [form] = Form.useForm();

  const onFinish = async (values) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match!");
      return;
    }

    try {

   const response = await url.post(`/api/reset-password/${token}`, {
        password: values.password,
      });
      
        console.log(response.data);
      message.success("Password reset successfully!");
      form.resetFields();
      navigate("/login");

    } catch (error) {
      message.error("Something went wrong!");
      console.log("Error:", error.response.data); 
    }
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Reset Password</h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            label="New Password"
            name="password"
            rules={[{ required: true, message: "Please enter your new password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirm Password"
            name="confirmPassword"
            rules={[{ required: true, message: "Please confirm your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
