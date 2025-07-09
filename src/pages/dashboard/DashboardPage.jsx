import React, { useEffect, useState } from 'react';
import {
  FolderPlus,
  FolderSync,
  CheckCircle,
  FileCheck,
  Briefcase,
  Loader2,
  Search,
} from 'lucide-react';

import StatsCart from '../../components/dashboard/StatsCart';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import url from '../../services/url';
import CommanTable from '../../comman/CommanTable';
import dayjs from 'dayjs';
import { Button,Input,Space } from 'antd';
import { useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';


const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [projects, setProjects] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
  



  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const res = await url.get('/projects', {
          params: {
            page: currentPage,
            limit: pageSize,
            search: searchTerm,
          },
        });
        console.log(res);

        

        setProjects(res.data.projects);
        setTotalItems(res.data.totalItems);
        setStatusCounts(res.data.counts);
        
      } catch (error) {
        console.error("Error fetching dashboard projects", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage, pageSize, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 size={30} className="animate-spin text-purple-600" />
      </div>
    );
  }

  const newCount = statusCounts["New"] || 0;
  const sentToCEOCount = statusCounts["Sent to CEO"] || 0;
  const approvedCount = statusCounts["Approved by Client"] || 0;
  const invoiceRaisedCount = statusCounts["Invoice Raised"] || 0;
  const totalCount = Object.values(statusCounts).reduce((a, b) => a + b, 0);


 const getColumnSearchProps = dataIndex => ({
  filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
    <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
      <Input
        ref={searchInput}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{ marginBottom: 8, display: 'block' }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: filtered => (
    <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
  ),
  onFilter: (value, record) =>
    record[dataIndex]?.toString().toLowerCase().includes(value.toLowerCase()),
  render: text =>
    searchedColumn === dataIndex ? (
      <span style={{ backgroundColor: '#ffc069', padding: 0 }}>{text}</span>
    ) : (
      text
    ),
});

const handleTableChange = (pagination, filters, sorter) => {
  setSortedInfo(sorter);
};


const columns = [
  {
    title: 'PROJECT NAME',
    dataIndex: 'projectName',
    key: 'projectName',
    ...getColumnSearchProps('projectName'),
    sorter: (a, b) => a.projectName.localeCompare(b.projectName),
    sortOrder: sortedInfo.columnKey === 'projectName' ? sortedInfo.order : null,
  },
  {
    title: 'TYPE',
    dataIndex: 'projectType',
    key: 'projectType',
    ...getColumnSearchProps('projectType'),
    sorter: (a, b) => a.projectType.localeCompare(b.projectType),
    sortOrder: sortedInfo.columnKey === 'projectType' ? sortedInfo.order : null,
  },
  {
    title: 'CLIENT',
    dataIndex: 'endClient',
    key: 'endClient',
    ...getColumnSearchProps('endClient'),
    sorter: (a, b) => a.endClient.localeCompare(b.endClient),
    sortOrder: sortedInfo.columnKey === 'endClient' ? sortedInfo.order : null,
  },
  {
    title: 'DATE RECEIVED',
    dataIndex: 'dateReceived',
    key: 'dateReceived',
    render: date => dayjs(date).format('DD/MM/YYYY'),
    ...getColumnSearchProps('dateReceived'),
    sorter: (a, b) => new Date(a.dateReceived) - new Date(b.dateReceived),
    sortOrder: sortedInfo.columnKey === 'dateReceived' ? sortedInfo.order : null,
  },
  {
  title: 'Status',
  dataIndex: 'status',
  key: 'status',
  sorter: (a, b) => a.status.localeCompare(b.status),
  sortOrder: sortedInfo.columnKey === 'status' ? sortedInfo.order : null,
},

  {
    title: 'ACTION',
    key: 'action',
    render: (_, record) => (
      <Button onClick={() => navigate(`/projects/${record._id}`)}>View</Button>
    ),
  },
];



// Add this just before the return (
const recentProjects = [...projects]
  .sort((a, b) => new Date(b.dateReceived) - new Date(a.dateReceived))
  .slice(0, 3);

console.log("Recent Projects", recentProjects);


  return (
    <div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <StatsCart title="New Project" value={newCount} icon={<FolderPlus size={20} />} linkTo="/projects/new" iconBgColor="bg-purple-100" iconColor="text-purple-600" />
        <StatsCart title="Sent to CEO" value={sentToCEOCount} icon={<FolderSync size={20} />} linkTo="/projects/new" iconBgColor="bg-blue-100" iconColor="text-blue-600" />
        <StatsCart title="Approved by Client" value={approvedCount} icon={<CheckCircle size={20} />} linkTo="/projects/new" iconBgColor="bg-green-100" iconColor="text-green-600" />
        <StatsCart title="Invoice Raised" value={invoiceRaisedCount} icon={<FileCheck size={20} />} linkTo="/projects/new" iconBgColor="bg-amber-100" iconColor="text-amber-600" />
        <StatsCart title="Total Projects" value={totalCount} icon={<Briefcase size={20} />} linkTo="/projects/new" iconBgColor="bg-indigo-100" iconColor="text-indigo-600" />
      </div>

      {/* Header & Add Project */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 gap-3">
        <h1 className="text-lg font-semibold text-gray-900">Recent Projects</h1>
        <Link to="/projects/create" className="bg-purple-600 text-white p-3 rounded-lg">New Project</Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm w-full my-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search projects..."
          className="pl-10 input max-w-sm border-gray-600 shadow-lg p-3 rounded-lg"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

    

      {/* Table */}
      <CommanTable
  projectdata={projects}
  pagination={{
    current: currentPage,
    pageSize: pageSize,
    total: totalItems,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20'],
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
  }}
  selectedRowKeys={selectedRowKeys}
  setSelectedRowKeys={setSelectedRowKeys}
 columns={columns}
  onChange={handleTableChange}
/>





      {/* Activity + Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Activity */}
    
<div className="bg-white rounded-lg shadow-lg shadow-purple-500">
  <h2 className="text-center mt-3 font-semibold text-gray-900 mb-4 tracking-wider">
    Recent Projects
  </h2>

  <div className="space-y-4">
    
 
     {recentProjects.map(project => (
        
        <div key={project._id} className="border p-3 rounded-lg">
        
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800">{project.projectName}</h3>
            <span className="text-xs text-gray-500">
              {format(new Date(project.createdAt), 'h:mm:ss a, dd MMM')}
            </span>
          </div>

          <div className="flex justify-between items-center mt-2">
            <p className="text-sm text-gray-600">
              {project.projectType} | {project.category}
            </p>
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                project.status === 'Invoice Raised'
                  ? 'bg-green-100 text-green-700'
                  : project.status === 'New'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {project.status}
            </span>
          </div>
        </div>
      ))}
  </div>
  
</div>

  
  
  

        {/* Summary */}
        <div className="p-4 bg-white rounded-lg shadow-lg shadow-purple-500">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 tracking-wider">Summary</h2>
          <div className="space-y-2 text-sm text-gray-700">
            {[
              ['Mockups', 8],
              ['Proposals', 4],
              ['Presentations', 2],
              ['Credentials', 3],
              ['RFP', 6],
              ['AI Work', 2],
              ['Creative Work', 1],
            ].map(([label, value]) => (
              <div className="flex justify-between" key={label}>
                <span>{label}</span><span>{value}</span>
              </div>
            ))}
            <div className="flex justify-between font-semibold text-gray-900 border-t pt-2 mt-2">
              <span>Total</span><span>{totalCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
