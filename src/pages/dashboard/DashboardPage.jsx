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
import url from '../../services/url'

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [RecentProject, setRecentProject] = useState([]);
    //pagination ka part hai
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [totalItems, setTotalItems] = useState(0);
    const [statusCounts, setStatusCounts] = useState({}); // add kari




    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await url.get('/projects', {
                    params: {
                        page: currentPage,
                        limit: itemsPerPage,
                    }
                });
                  
                console.log("Projects response:", res.data);
                 setRecentProject(res.data.projects);
                  setTotalItems(res.data.totalItems);
                  setStatusCounts(res.data.counts); //add kari
            
            } catch (error) {
                console.error("Error fetching dashboard projects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [currentPage]);


    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 size={30} className="animate-spin text-purple-600" />
            </div>
        );
    }

    // calculate count based on status
  const newCount = statusCounts["New"] || 0;
const sentToCEOCount = statusCounts["Sent to CEO"] || 0;
const approvedCount = statusCounts["Approved by Client"] || 0; //add kari
const invoiceRaisedCount = statusCounts["Invoice Raised"] || 0;
const totalCount = Object.values(statusCounts).reduce((a, b) => a + b, 0);





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
                    <RecentProjectsList projects={RecentProject} />
                </div>
                <div className='mt-6 flex justify-center'>
                    <Pagination
                        current={currentPage}
                        pageSize={itemsPerPage}
                        total={totalItems}
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