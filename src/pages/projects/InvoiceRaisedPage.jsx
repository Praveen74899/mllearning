import { Search, Download } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useMyContext } from '../../contexts/AuthContext';
import CommanTable from '../../comman/CommanTable';
import url from '../../services/url';
import dayjs from 'dayjs';
import { Tag, Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useRef } from 'react';

const InvoiceRaisedPage = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const searchInput = useRef(null);
    const [searchedColumn, setSearchedColumn] = useState('');
const [sortedInfo, setSortedInfo] = useState({});

  const { exportToExcel,getStatusColor } = useMyContext();

  const fetchProjects = async () => {
    try {
      const res = await url.get('/projects/invoice-raised', {
        params: {
          page: currentPage,
          limit: pageSize,
          search: searchTerm,
        },
      });

      setProjects(res.data.projects);
      setTotalItems(res.data.totalItems);
    } catch (err) {
      console.error('Failed to fetch invoice raised projects', err);
      toast.error("Error fetching projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [currentPage, pageSize, searchTerm]);

  const handleExport = () => {
    exportToExcel(projects, 'invoice-raised-projects');
  };

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
      <Button onClick={() => navigate(`/projects/${record._id}`)}>View</Button>
    ),
  },
 
];







  return (
    <div className="p-4">
      {/* Header actions */}
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

        <button
          onClick={handleExport}
          className="bg-purple-600 p-2 text-white rounded-lg flex items-center gap-2"
        >
          <Download size={18} />
          <span>Export</span>
        </button>
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

export default InvoiceRaisedPage;
