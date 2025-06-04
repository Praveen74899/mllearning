const mongoose = require('mongoose');
const { string } = require('yup');

const projectSchema = new mongoose.Schema({

    projectName:{
        type:String,
        require:true,
        uniqued:true
    },
    projectType:{
         type:String,
         required:true
    },
    category:{
        type:String,
        required:true
    },
    dateReceived:{
        type:Date,
        required:true
    },
    dateDelivered:{
        type:Date,
    },
    contactPerson:{
        type:String,
    },
    endClient:{
        type:String,
        required:true
    },
    status: {
  type: String,
  enum: ['New', 'Sent to CEO', 'Approved by Client', 'Invoice Raised'],
  default: 'New'
}
});
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;

