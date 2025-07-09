

import { Search, Download, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
 import { useMyContext } from '../../contexts/AuthContext';
import url from '../../services/url'
import dayjs from 'dayjs';
import { Tag, Button } from 'antd';
import CommanTable from '../../comman/CommanTable';
import { Navigate } from 'react-router-dom';
import { useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons'; // ✅ Needed
import { Input, Space,} from 'antd'; // 

const NewProjectPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const {exportToExcel,getStatusColor} = useMyContext();

  //pagination ka hai
  const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
   const [totalItems, setTotalItems] = useState(0);
const [searchError, setSearchError] = useState('');
const [searchedColumn, setSearchedColumn] = useState('');
const [searchText, setSearchText] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [sortedInfo, setSortedInfo] = useState({});

 const searchInput = useRef('null');

  const fetchProjects = async () => {
  try {
    const res = await url.get('/projects/new', {
      params: {
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm
      }
    });

    const fetchedProjects = res.data.projects;

    if (fetchedProjects.length === 0) {
      setSearchError("No project found with this name.");
    } else {
      setSearchError(""); // error reset if results found
    }

    setProjects(fetchedProjects);
    setTotalItems(res.data.totalItems);
    setSearchTerm("");  // Clear the input after search

  } catch (err) {
    console.error('Error fetching projects:', err);
    setSearchError("Failed to fetch projects");
    toast.error('Failed to fetch projects');
  }
};

useEffect(()=>{
 fetchProjects();
},[currentPage])



  const handleSendToCEO = async () => {
    if (selectedRowKeys.length === 0) {
      toast.error("Please select at least one project");
      return;
    }

    try {
      const response = await url.put(`/projects/update`, {
        projectIds: selectedRowKeys,
        status: "Sent to CEO"
      });

      toast.success("Projects sent to CEO successfully");

      // Update UI after success
      setProjects(projects.filter(project => !selectedRowKeys.includes(project._id)));
      setSelectedRowKeys([]); // Clear selection


    } catch (error) {
      console.error("Error sending to CEO:", error);
      toast.error('Failed to send projects to CEO');
    }
  };




const handleExport = async ()=>{
   exportToExcel(projects, "projects");
}


const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
};



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
    title: 'PROJECT ID',
    dataIndex: '_id',
    key: '_id',
  
 },

  {
    title: 'PROJECT NAME',
    dataIndex: 'projectName',
    key: 'projectName',
      ...getColumnSearchProps('projectName'),
        sorter: (a, b) => a.projectName.localeCompare(b.projectName),
  sortOrder: sortedInfo.columnKey === 'projectName' && sortedInfo.order,
  },
  {
    title: 'TYPE',
    dataIndex: 'projectType',
    key: 'projectType',
      ...getColumnSearchProps('projectType'),
        sorter: (a, b) => a.projectType.localeCompare(b.projectType),
  sortOrder: sortedInfo.columnKey === 'projectType' && sortedInfo.order,
  },
  {
    title: 'CLIENT',
    dataIndex: 'endClient',
    key: 'endClient',
      ...getColumnSearchProps('endClient'),
        sorter: (a, b) => a.endClient.localeCompare(b.endClient),
  sortOrder: sortedInfo.columnKey === 'endClient' && sortedInfo.order,
  },
  {
    title: 'DATE RECEIVED',
    dataIndex: 'dateReceived',
    key: 'dateReceived',
    render: (date) => dayjs(date).format('DD/MM/YYYY'),
      ...getColumnSearchProps('dateReceived'),
       sorter: (a, b) => new Date(a.dateReceived) - new Date(b.dateReceived),
    sortOrder: sortedInfo.columnKey === 'dateReceived' ? sortedInfo.order : null,
  },
  {
    title: 'STATUS',
    dataIndex: 'status',
    key: 'status',
    render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
      ...getColumnSearchProps('status'),
        sorter: (a, b) => a.status.localeCompare(b.status),
  sortOrder: sortedInfo.columnKey === 'status' && sortedInfo.order,
  },
  {
    title: 'ACTION',
    key: 'action',
    render: (_, record) => (
      <Button onClick={() => Navigate(`/projects/${record._id}`)}>View</Button>
    ),
  },
 
];



  return (
    <div className='p-4'>
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
         <div>
  <input
    type="text"
    placeholder="Search projects..."
    className="pl-10 input max-w-sm border-gray-600 shadow-lg p-3 rounded-lg"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <button
    className='bg-black text-white p-2 m-2 rounded-lg'
    onClick={fetchProjects}
  >
    GO
  </button>

  {searchError && (
    <p className="text-red-500 mt-2">{searchError}</p>
  )}
</div>

          
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className=" bg-purple-600 p-2 text-white rounded-lg flex items-center gap-2"
          >
            <Download size={18} />
            <span>Export</span>
          </button>

          <button
            onClick={handleSendToCEO}
            disabled={selectedRowKeys.length === 0}
            className={`p-2 text-white rounded-lg flex items-center gap-2 ${selectedRowKeys.length === 0 ? 'bg-purple-300 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            <Send size={18} />
            <span>Send to CEO</span>
          </button>

        </div>
      </div>


      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mt-3">
        
















<CommanTable
projectdata={projects}
  pagination = {{
    current: currentPage,
    pageSize: itemsPerPage,
    total: totalItems,
    showSizeChanger: true,
    pageSizeOptions: ['5', '10', '20'],
    onChange: (page, size) => {
      setCurrentPage(page);
      setItemsPerPage(size); 
      if (size !== itemsPerPage) {
        setCurrentPage(1);
      }
    },
  }}
       selectedRowKeys={selectedRowKeys}
      setSelectedRowKeys={setSelectedRowKeys}
   columns={columns}
     onChange={handleTableChange}
/>















        
      </div>



    </div>
  );
};

export default NewProjectPage;
