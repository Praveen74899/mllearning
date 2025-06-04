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



// Get All Projects
exports.getAllProjects = async (req, res) => {
    try {
        console.log("yaha hu")
        const projects = await Project.find().sort({ createdAt: -1 }); // Optional: filter by status
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch projects" });
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
        const sentProjects = await Project.find({ status: "Sent to CEO" });
        res.status(200).json(sentProjects);
    } catch (err) {
        console.error("Error fetching Sent to CEO projects:", err);
        res.status(500).json({ error: "Server error" });
    }
}

exports.getApprovedProjects = async (req, res) => {
    try {
        const ApprovedProjects = await Project.find({ status: "Approved by Client"});
        console.log(ApprovedProjects)
        res.status(200).json(ApprovedProjects);
    } catch (err) {
        console.error("Error fetching Sent to CEO projects:", err);
        res.status(500).json({ error: "Server error" });
    }
}

exports.getInvoiceProjects = async (req, res) => {
    try {
        const ApprovedProjects = await Project.find({ status: "Invoice Raised"});
        console.log(ApprovedProjects)
        res.status(200).json(ApprovedProjects);
    } catch (err) {
        console.error("Error fetching Sent to CEO projects:", err);
        res.status(500).json({ error: "Server error" });
    }
}





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
