
import { Search, Download, Send } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Pagination } from 'antd';
import { Link } from 'react-router-dom';
const url = import.meta.env.VITE_BACKEND_URL;
 import { useMyContext } from '../../contexts/AuthContext';


const InvoiceRaisedPage = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

   const {exportToExcel} = useMyContext();

  //pagination ka hai
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredProjects = projects.filter((project) =>
    project.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProjects.slice(indexOfFirstItem, indexOfLastItem);


  useEffect(() => {
    const InvoiceRaised = async () => {
      try {
        const res = await axios.get(`${url}/projects/invoice-raised`);
        console.log("invoice ka data", res.data);
        setProjects(res.data);
      } catch (error) {
        console.error("Failed to fetch sent projects", error);
      }
    };

    InvoiceRaised();
  }, []);



  const handleExport = async ()=>{
   exportToExcel(projects, "projects");
}


  return (
    <div className='p-4'>
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative">
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
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className=" bg-purple-600 p-2 text-white rounded-lg flex items-center gap-2"
          >
            <Download size={18} />
            <span>Export</span>
          </button>


        </div>
      </div>


      <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mt-3">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3">
                <div className="flex items-center gap-2">


                  <input
                    type="checkbox"
                    checked={projects.length > 0 && selectedProjects.length === projects.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProjects(projects.map(p => p._id)); // select all
                      } else {
                        setSelectedProjects([]); // deselect all
                      }
                    }}
                    className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                  />
                  <span className="text-xs font-medium text-gray-500 uppercase">Select</span>
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Received</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {currentItems.map((project) => (
              <tr key={project._id}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedProjects.includes(project._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedProjects([...selectedProjects, project._id]);
                      } else {
                        setSelectedProjects(selectedProjects.filter(id => id !== project._id));
                      }
                    }}
                    className="h-4 w-4 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                  />

                </td>
                <td className="px-4 py-3">{project.projectName}</td>
                <td className="px-4 py-3">{project.projectType}</td>
                <td className="px-4 py-3">{project.endClient}</td>
                <td className="px-4 py-3">{new Date(project.dateReceived).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {project.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/projects/${project._id}`}
                    className="text-purple-600 hover:text-purple-900"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <div className='mt-6 flex justify-center'>
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={filteredProjects.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>

    </div>
  );
};

export default InvoiceRaisedPage;
