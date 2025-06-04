import React from 'react'
import { format } from 'date-fns';
 import { Link } from 'react-router-dom';
const RecentProjectsList = ({ projects }) => {
  console.log("yaha par Recentproject me bhi aa gaya ", projects);
  if (!projects || projects.length === 0) {
    return <p>No recent projects.</p>;
  }

  return (

    <div className="overflow-x-auto">

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Project Name
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Received
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              View
            </th>


          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {projects.length > 0 ? (
            projects.map((project) => (
              <tr key={project._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{project.projectName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{project.projectType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{project.endClient}</div>
                  <div className="text-xs text-gray-500">{project.contactPerson}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {format(new Date(project.dateReceived), 'dd/MM/yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${project.status === 'New' ? 'bg-purple-100 text-purple-800' :
                      project.status === 'Sent to CEO' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'Approved by Client' ? 'bg-green-100 text-green-800' :
                          'bg-amber-100 text-amber-800'
                    }`}>
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
            ))
          ) : (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                No recent projects found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

}

export default RecentProjectsList