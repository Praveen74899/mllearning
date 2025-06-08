import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectRoute from './ProtectRoute';
import  { Suspense, lazy } from 'react';

const Register = lazy(() => import('../pages/auth/Register'));
const Login = lazy(()=> import ('../pages/auth/Login'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const Layout = lazy(() => import('../components/layout/Layout'));
const NewProjectPage = lazy(() => import('../pages/projects/NewProjectPage'));
const SentToCEOPage = lazy(() => import('../pages/projects/SentToCEOPage'));
const ApprovedByClientPage = lazy(() => import('../pages/projects/ApprovedByClientPage'));
const InvoiceRaisedPage = lazy(() => import('../pages/projects/InvoiceRaisedPage'));
const CreateProjectPage = lazy(() => import('../pages/projects/CreateProjectPage'));
const ProjectDetails = lazy(() => import('../pages/projects/ProjectDetails'));



const AppRoutes = () => {
  return (
     <Suspense fallback={<div className="text-center text-lg">Loading...</div>}>
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
    </Suspense> 
  );
};

export default AppRoutes;
