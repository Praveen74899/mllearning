import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import url from '../../services/url';

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    url.get(`/projects/${id}`)
      .then(res => setProject(res.data))
      .catch(err => console.error('Error fetching project:', err));
  }, [id]);

  if (!project) return <div className="text-center text-gray-500 p-10">Loading...</div>;



  return (
  <div className="flex justify-center items-center bg-gray-100 px-4 py-10">
  <div className="bg-white border border-purple-200 shadow-md shadow-purple-300 rounded-xl p-8 w-full max-w-2xl transition-all duration-300 ">
    <h2 className="text-3xl font-semibold text-center text-purple-700 mb-6 tracking-tight">
      📋 Project Overview
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-800 text-base">
      <p><strong className="text-purple-600">📌 Name:</strong> {project.projectName}</p>
      <p><strong className="text-purple-600">🧩 Type:</strong> {project.projectType}</p>
      <p><strong className="text-purple-600">📂 Category:</strong> {project.category}</p>
      <p><strong className="text-purple-600">📈 Status:</strong> {project.status}</p>
      <p><strong className="text-purple-600">📥 Received:</strong> {new Date(project.dateReceived).toLocaleDateString()}</p>
      <p><strong className="text-purple-600">👤 Client:</strong> {project.endClient}</p>
     
    </div>

    <div className="flex justify-end mt-8 gap-4">
      <button
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300 transition"
      >
        ⬅️ Back
      </button>
     
    </div>
  </div>
</div>

  );

};

export default ProjectDetails;
