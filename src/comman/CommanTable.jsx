import React, { useState } from 'react';
import { Button, Table, Tag } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const CommanTable = ({ projectdata, pagination, selectedRowKeys, setSelectedRowKeys, columns,  onChange }) => {
  const navigate = useNavigate();


  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  



  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={projectdata}
      pagination={pagination}
      rowKey="_id"
      scroll={{ x: 'max-content' }}
        onChange={onChange} 
    />
  );
};

export default CommanTable;
