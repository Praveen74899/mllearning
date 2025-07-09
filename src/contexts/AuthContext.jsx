import { createContext, useContext, useState, useEffect } from 'react';


  //export file  ko download karega or convert karega xlsx me
  import * as XLSX from "xlsx"; // convert project data ko xlxs me 
import { saveAs } from "file-saver"; //download project data

import url from '../services/url'
const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  //  Restore user on reload
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUser({ ...JSON.parse(userData), token });
    }
    setLoading(false);
  }, []);

  //  Login
  const login = async (email, password) => {
    try {
      const res = await url.post('/api/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } });

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser({ ...user, token });
      
    return true;
    }catch (error) {
  console.error(error);
  res.status(500).json({ message: 'Login failed' });
}
  };

  //  Register
  const register = async (name, email, password) => {
    try {
      const res = await url.post('/api/register',
        { name, email, password },
        { headers: { 'Content-Type': 'application/json' } });

      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser({ ...user, token });
      return true;
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Registration failed!");
      } else {
        alert("Server se connection nahi ban raha.");
      }
          return false; 
    }
  };





 
const exportToExcel = (data, fileName = "data") => {
  // Step 1: JSON data to worksheet
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Step 2: Create a workbook and append the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Step 3: Generate buffer
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Step 4: Create blob and trigger download
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${fileName}.xlsx`);
};
  

const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'blue';
      case 'Sent to CEO': return 'orange';
      case 'Approved by Client': return 'green';
      case 'Invoice Raised': return 'purple';
      default: return 'default';
    }
  };




  const value = { user, setUser, login, register,loading,exportToExcel,getStatusColor };

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
