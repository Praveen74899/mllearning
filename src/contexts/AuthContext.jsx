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
    } catch (error) {
      throw error;
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
    }
  };





 const exportToExcel = (data, fileName = "data") => {
  // Step 1: Data se worksheet banao
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Step 2: Workbook (Excel file) banao aur worksheet daalo
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Step 3: Excel file ko binary me convert karo
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  // Step 4: Excel ko download karo
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${fileName}.xlsx`);
};

  






  const value = { user, setUser, login, register,loading,exportToExcel };

  return (
    <MyContext.Provider value={value}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => useContext(MyContext);
