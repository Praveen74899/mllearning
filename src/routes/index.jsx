import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectRoute from './ProtectRoute';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import DashboardPage from '../pages/dashboard/DashboardPage';
import Layout from '../components/layout/Layout';
import NewProjectPage from '../pages/projects/NewProjectPage';
import SentToCEOPage from '../pages/projects/sentToCEOPage';
import ApprovedByClientPage from '../pages/projects/ApprovedByClientPage';
import InvoiceRaisedPage from '../pages/projects/InvoiceRaisedPage'
import CreateProjectPage from '../pages/projects/CreateProjectPage';
import ProjectDetails from '../pages/projects/ProjectDetails';



const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />

          <Route path="projects">
            <Route path="new" element={<NewProjectPage />} />
            <Route path="sent-to-ceo" element={<SentToCEOPage />} />
            <Route path="approved-by-client" element={<ApprovedByClientPage />} />
            <Route path="invoice-raised" element={<InvoiceRaisedPage />} />
            <Route path="create" element={<CreateProjectPage />} />
            <Route path=":id" element={<ProjectDetails />} />
                                      

          </Route>

        </Route>

      </Route>
    </Routes>
  );
};

export default AppRoutes;
