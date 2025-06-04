import React, { useEffect, useState } from 'react'
import {
    FolderPlus,
    FolderSync,
    CheckCircle,
    FileCheck,
    Briefcase,
    Loader2,

} from 'lucide-react';
import StatsCart from '../../components/dashboard/statsCart'
import RecentProjectsList from '../../components/dashboard/RecentProjectsList'
import { Link } from 'react-router-dom';
import { Pagination } from 'antd';
import { format } from 'date-fns';
const url = import.meta.env.VITE_BACKEND_URL;

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [RecentProject, setRecentProject] = useState([]);
    //pagination ka part hai
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = RecentProject.slice(indexOfFirstItem, indexOfLastItem);



    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(`${url}/projects/new`);
                const data = await res.json();
                console.log("Dashboard Projects Sample: ", data.slice(0, 3));
                console.log(RecentProject)
                setRecentProject(data);
            } catch (error) {
                console.error("Error fetching dashboard projects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);


    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 size={30} className="animate-spin text-purple-600" />
            </div>
        );
    }

    // calculate count basec on status
    const newCount = RecentProject.filter(p => p.status === 'New').length;
    const sentToCEOCount = RecentProject.filter(p => p.status === 'Sent to CEO').length;
    const approvedCount = RecentProject.filter(p => p.status === 'Approved by Client').length;
    const invoiceRaisedCount = RecentProject.filter(p => p.status === 'Invoice Raised').length;
    const totalCount = RecentProject.length;





    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                <StatsCart
                    title="New Project"
                    value={newCount}
                    icon={<FolderPlus size={20} />}
                    linkTo="/projects/new"
                    iconBgColor="bg-purple-100"
                    iconColor="text-purple-600"
                />

                <StatsCart
                    title="Sent to CEO"
                    value={sentToCEOCount}
                    icon={<FolderSync size={20} />}
                    linkTo="/projects/new"
                    iconBgColor="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <StatsCart
                    title="Approved by Client"
                    value={approvedCount}
                    icon={<CheckCircle size={20} />}
                    linkTo="/projects/new"
                    iconBgColor="bg-green-100"
                    iconColor="text-green-600"
                />
                <StatsCart
                    title="Invoice Raised"
                    value={invoiceRaisedCount}
                    icon={<FileCheck size={20} />}
                    linkTo="/projects/new"
                    iconBgColor="bg-amber-100"
                    iconColor="text-amber-600"
                />
                <StatsCart
                    title="Total Projects"
                    value={totalCount}
                    icon={<Briefcase size={20} />}
                    linkTo="/projects/new"
                    iconBgColor="bg-indigo-100"
                    iconColor="text-indigo-600"
                />
            </div>

            <div>
                <div className='flex justify-between mt-4'>

                    <div className='text-lg font-semibold text-gray-900 mt-3'>
                        <h1>Recent Projects </h1>
                    </div>

                    <Link
                        to="/projects/create"
                        className='bg-purple-600 text-white p-3 text-center rounded-lg m-2'
                    >
                        New Project
                    </Link>

                </div>

                <div>
                    <RecentProjectsList projects={currentItems} />
                </div>
                <div className='mt-6 flex justify-center'>
                    <Pagination
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={RecentProject.length}
                        onChange={(page) => setCurrentPage(page)}
                    />
                </div>


                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Today's Activity */}
            
                     <div className=" bg-white rounded-lg shadow-lg shadow-purple-500">
                        <h2 className=" text-center  mt-3 font-semibold text-gray-900 mb-4 tracking-wider">Today's Activity</h2>
                        <div className="space-y-4">
                            {[...RecentProject]
                                .filter(p => p.dateReceived)
                                .sort((a, b) => new Date(b.dateReceived) - new Date(a.dateReceived))

                                .slice(0, 3).map((project, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start space-x-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition p-3"
                                    >
                                        <div
                                            className={`p-2 rounded-full ${project.status === 'New'
                                                ? 'bg-purple-100 text-purple-600'
                                                : project.status === 'Sent to CEO'
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : project.status === 'Approved by Client'
                                                        ? 'bg-green-100 text-green-600'
                                                        : 'bg-amber-100 text-amber-600'
                                                }`}
                                        >
                                            {project.status === 'New' ? (
                                                <FolderPlus size={20} />
                                            ) : project.status === 'Sent to CEO' ? (
                                                <FolderSync size={20} />
                                            ) : project.status === 'Approved by Client' ? (
                                                <CheckCircle size={20} />
                                            ) : (
                                                <FileCheck size={20} />
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-gray-800">{project.projectName}</p>
                                            <p className="text-xs text-gray-600 ">
                                                Status updated to <span className="font-medium">{project.status}</span>
                                            </p>
                                            <p className="text-xs text-gray-400 ">
                                                {format(new Date(project.dateReceived), 'h:mm a')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div> 

                    {/* Summary */}
                    <div className="p-4 bg-white rounded-lg shadow-lg shadow-purple-500 ">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 tracking-wider">Summary</h2>
                        <div className="space-y-2 text-sm text-gray-700">
                            <div className="flex justify-between">
                                <span>Mockups</span>
                                <span>8</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Proposals</span>
                                <span>4</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Presentations</span>
                                <span>2</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Credentials</span>
                                <span>3</span>
                            </div>
                            <div className="flex justify-between">
                                <span>RFP</span>
                                <span>6</span>
                            </div>
                            <div className="flex justify-between">
                                <span>AI Work</span>
                                <span>2</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Creative Work</span>
                                <span>1</span>
                            </div>
                            <div className="flex justify-between font-semibold text-gray-900 border-t pt-2 mt-2">
                                <span>Total</span>
                                <span>{totalCount}</span>
                            </div>
                        </div>
                    </div>
                </div>


            </div>

        </div>
    )
}

export default DashboardPage