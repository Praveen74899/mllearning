const { message } = require("antd");
const Project = require("../models/project");

exports.createprojectController = async (req, res) => {
    try {
        console.log("Incoming request body:", req.body);
        const {
            projectName,
            projectType,
            category,
            dateReceived,
            dateDelivered,
            contactPerson,
            endClient,
        } = req.body;


        if (!projectName || !projectType || !category || !dateReceived || !dateDelivered || !contactPerson || !endClient) {
            return res.status(400).json({
                message: "All fields are required",
            })
        }

        const existingProject = await Project.findOne({ projectName });
        if (existingProject) {
            return res.status(400).json({
                message: "Project are already used",
            })
        }

        const newProject = new Project({
            projectName,
            projectType,
            category,
            dateReceived,
            dateDelivered,
            endClient,
        });
        //console.log(newProject);
        await newProject.save();

        res.status(201).json({
            message: "project create successfully",
            project: newProject,
        });

    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).json({
            message: 'Error creating project',
            error: error.message
        });
    }

};









// Get All Projects new me jayenge 
exports.getNewProjects = async (req, res) => {
  try {
    let { page = 1, limit = 5, search = '' } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    // Filter for only "New" status projects + search on projectName
    const filter = {
      status: 'New',
      projectName: { $regex: search, $options: 'i' }  // case-insensitive search
    };

    // Count total matching documents (for pagination)
    const totalItems = await Project.countDocuments(filter);

    // Find paginated projects
    const projects = await Project.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ dateReceived: -1 }); // latest first

    return res.json({ projects, totalItems });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching new projects' });
  }
};











// dashboard pe pagination or controller

 exports.getDashboardController = async(req,res) =>{
     try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const filter = {};
   
    const totalItems = await Project.countDocuments(filter);


    const projects = await Project.find(filter)
  .skip((page - 1) * limit)
  .limit(limit);

// 👇 status-wise count laane ke liye aggregate use karte hain
const statusCountsArray = await Project.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
]);

// 👇 Is array ko object me convert karte hain
const counts = {};
statusCountsArray.forEach(item => {
  counts[item._id] = item.count;
});

// ✅ Final Response
res.status(200).json({
  projects,
  totalItems,
  counts, // 👈 yeh frontend me jayega
});

//     const projects = await Project.find(filter)
//       .sort({ createdAt: -1 }) // latest first
//       .skip((page - 1) * limit)
//       .limit(limit);

//     res.status(200).json({ projects, totalItems });

  } catch (err) {
    console.error("Pagination error:", err);
    res.status(500).json({ message: "Server Error" });
  }
 };


















// PUT /projects/update
exports.updateStatudController = async (req, res) => {
    const { projectIds, status } = req.body;
    console.log("update data hai ",req.body);
    try {
        if (!projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
            return res.status(400).json({ error: "No project IDs provided" });
        }

        await Project.updateMany(
            { _id: { $in: projectIds } },
            { $set: { status: status  } }
        );

        res.status(200).json({ message: "Projects sent  successfully" });
    } catch (error) {
        console.error("Error updating project status:", error);
        res.status(500).json({ error: "Server error" });
    }
};















exports.getSentToCEOProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";

    const filter = {
      status: "Sent to CEO",
      projectName: { $regex: search, $options: "i" }
    };

    const totalItems = await Project.countDocuments(filter);

    const projects = await Project.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ projects, totalItems });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching projects" });
  }
};











// exports.getApprovedProjects = async (req, res) => {
//     try {
//         const ApprovedProjects = await Project.find({ status: "Approved by Client"});
//         console.log(ApprovedProjects)
//         res.status(200).json(ApprovedProjects);
//     } catch (err) {
//         console.error("Error fetching Sent to CEO projects:", err);
//         res.status(500).json({ error: "Server error" });
//     }
// }


 exports.getApprovedProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
     const search = req.query.search || "";
    
    const skip = (page - 1) * limit;

    // Only fetch projects with status "Approved by Client"
    const filter = { status: "Approved by Client" ,  projectName: { $regex: search, $options: "i" }};

    const totalItems = await Project.countDocuments(filter); // total count
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 }) // latest first
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      projects,
      totalItems,
    });

  } catch (error) {
    console.error("Error fetching approved projects:", error);
    res.status(500).json({ message: "Failed to fetch approved projects" });
  }
};
















// exports.getInvoiceProjects = async (req, res) => {
//     try {
//         const ApprovedProjects = await Project.find({ status: "Invoice Raised"});
//         console.log(ApprovedProjects)
//         res.status(200).json(ApprovedProjects);
//     } catch (err) {
//         console.error("Error fetching Sent to CEO projects:", err);
//         res.status(500).json({ error: "Server error" });
//     }
// }














// GET /projects/:id
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// controllers/projectController.js
// exports.getInvoiceProjects = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 5;
//     const search = req.query.search || "";

//     const filter = {
//       status: "Invoice Raised",
//       projectName: { $regex: search, $options: "i" }
//     };

//     const totalItems = await Project.countDocuments(filter);
//     const projects = await Project.find(filter)
//       .skip((page - 1) * limit)
//       .limit(limit);

//     res.json({ projects, totalItems });
//   } catch (error) {
//     console.error("Error fetching invoice raised projects:", error);
//     res.status(500).json({ message: "Failed to fetch invoice raised projects" });
//   }
// };

// controllers/projectController.js
exports.getInvoiceProjects = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";

    const filter = {
      status: "Invoice Raised",
      projectName: { $regex: search, $options: "i" }
    };

    const totalItems = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ projects, totalItems });
  } catch (error) {
    console.error("Error fetching invoice raised projects:", error);
    res.status(500).json({ message: "Failed to fetch invoice raised projects" });
  }
};


