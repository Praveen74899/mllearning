const express = require('express');
const router = express.Router();

const {createprojectController,getAllProjects,updateStatudController,getSentToCEOProjects,getApprovedProjects,getInvoiceProjects,getProjectById} = require('../controllers/projectController');

router.post('/create',createprojectController);
router.get('/new', getAllProjects)
router.put('/update', updateStatudController);
router.get('/sent-to-ceo', getSentToCEOProjects)
router.get('/approved-by-client',getApprovedProjects )
router.get('/invoice-raised',getInvoiceProjects);
router.get('/:id',getProjectById);



module.exports = router;