import React from 'react';
import { Form, Input, Select, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import { toast } from 'react-hot-toast';
import url from '../../services/url'
import { useNavigate } from 'react-router-dom';

const { Option } = Select;


const CreateProjectPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const formatted = {
                ...values,
               dateReceived: values.dateReceived.toISOString(), 
            dateDelivered: values.dateDelivered.toISOString(), 
            };
           // console.log('Sending data:', formatted);

            const res = await url.post('projects/create',
                formatted,
                { headers: { 'Content-Type': 'application/json' } });
                console.log("this is the created json data ",res);
                //  llllllllllllllllllll
            toast.success("Project created successfully!");
            form.resetFields();
             navigate('/projects/new');
        } catch (error) {
            console.error(error);
            toast.error("Project creation failed");
            
        }

    };


    return (
        <div className="min-h-screen bg-gray-100 p-4 ">
  <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 md:p-8 max-w-xl mx-auto ">
    
        <Form
            //form.resetFields();
            form={form}
            layout="vertical"
            onFinish={onFinish}
            style={{ maxWidth: 600, margin: '0 auto' }}
            className='grid grid-cols-2 gap-2'
        >
            <Form.Item
                label="Project Name"
                name="projectName"
                rules={[{ required: true, message: 'Please enter project name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="Project Type"
                name="projectType"
                rules={[{ required: true, message: 'Please select project type' }]}
            >
                <Select placeholder="Select project type">
                    <Option value="Mockups">Mockups</Option>
                    <Option value="Proposals">Proposals</Option>
                    <Option value="Presentations">Presentations</Option>
                    <Option value="Credentials">Credentials</Option>
                    <Option value="RFP">RFP</Option>
                    <Option value="AI Work">AI Work</Option>
                    <Option value="Creative Work">Creative Work</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please select category' }]}
            >
                <Select placeholder="Select category">
                    <Option value="Simple">Simple</Option>
                    <Option value="Medium">Medium</Option>
                    <Option value="Complex">Complex</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Date Received"
                name="dateReceived"
                rules={[{ required: true, message: 'Required' }]}
            >
                <DatePicker
                    style={{ width: '100%' }}
                    disabledDate={(current) => current && !current.isSame(dayjs(), 'day')}
                />
            </Form.Item>
            <Form.Item
                label="Date Delivered"
                name="dateDelivered"
                rules={[{ required: true, message: 'Required' }]}
            >
                <DatePicker
                    style={{ width: '100%' }}
                    disabledDate={(current) => {
                        const tomorrow = dayjs().add(1, 'day').startOf('day');
                        return current && current.isBefore(tomorrow, 'day');
                    }}
                />
            </Form.Item>


            <Form.Item
                label="Contact Person"
                name="contactPerson"
                rules={[{ required: true, message: 'Please enter contact person' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="End Client Name"
                name="endClient"
                rules={[{ required: true, message: 'Please enter end client name' }]}
            >
                <Input />
            </Form.Item>

            <Form.Item className="col-span-2 text-center">
                <Button type="primary" htmlType="submit">
                    Create Project
                </Button>
            </Form.Item>
        </Form>
        </div>
        </div>
    );
};

export default CreateProjectPage;
