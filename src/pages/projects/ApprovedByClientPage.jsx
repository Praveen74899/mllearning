
import React, { useEffect, useRef, useState } from 'react';
import { Search, Download, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useMyContext } from '../../contexts/AuthContext';
import url from '../../services/url';
import CommanTable from '../../comman/CommanTable';
import dayjs from 'dayjs';
import { Tag, Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

import { useNavigate } from 'react-router-dom';

const ApprovedByClientPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

const [sortedInfo, setSortedInfo] = useState({});


  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);

  const { exportToExcel, getStatusColor } = useMyContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [currentPage, pageSize, searchTerm]);

  const fetchProjects = async () => {
    try {
      const res = await url.get('/projects/approved-by-client', {
        params: { page: currentPage, limit: pageSize, search: searchTerm },
      });
      setProjects(res.data.projects);
      setTotalItems(res.data.totalItems);
    } catch (error) {
      console.error('Failed to fetch approved projects', error);
      toast.error('Error fetching projects');
    }
  };

  const handleInvoiceRaised = async () => {
    if (selectedRowKeys.length === 0) {
      toast.error('Please select at least one project');
      return;
    }
    try {
      await url.put('/projects/update', {
        projectIds: selectedRowKeys,
        status: 'Invoice Raised',
      });
      toast.success('Projects marked as Invoice Raised');
      setProjects(prev => prev.filter(p => !selectedRowKeys.includes(p._id)));
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('Error updating status', error);
      toast.error('Failed to update projects');
    }
  };

  const handleExport = () => {
    exportToExcel(projects, 'approved-by-client-projects');
  };

  // 🔍 Column Search Handler
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
  confirm();
  setSearchText(selectedKeys[0]);
  setSearchedColumn(dataIndex);
};

const handleReset = (clearFilters) => {
  clearFilters();
  setSearchText('');
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

  return (
    <div className="p-4">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 w-full mb-4">
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search projects..."
            className="pl-10 input max-w-sm border-gray-600 shadow-lg p-3 rounded-lg w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="bg-purple-600 p-2 text-white rounded-lg flex items-center gap-2"
          >
            <Download size={18} />
            <span>Export</span>
          </button>

          <button
            onClick={handleInvoiceRaised}
            disabled={selectedRowKeys.length === 0}
            className={`p-2 text-white rounded-lg flex items-center gap-2 ${
              selectedRowKeys.length === 0
                ? 'bg-purple-300 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            <Send size={18} />
            <span>Invoice Raised</span>
          </button>
        </div>
      </div>

      

      {/* Table */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
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
      </div>
    </div>
  );
};

export default ApprovedByClientPage;
