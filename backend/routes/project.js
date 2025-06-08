// const express = require('express');
// const router = express.Router();

// const {createprojectController,getNewProjects,updateStatudController,getSentToCEOProjects,getApprovedProjects,getInvoiceProjects,getProjectById,getDashboardController} = require('../controllers/projectController');

// router.post('/create',createprojectController);
// router.get('/new', getNewProjects)
// router.put('/update', updateStatudController);
// router.get('/sent-to-ceo', getSentToCEOProjects)
// router.get('/approved-by-client',getApprovedProjects )
// router.get('/invoice-raised',getInvoiceProjects);
// router.get('/:id',getProjectById);
// router.get('/', getDashboardController);


// module.exports = router;

const express = require('express');
const router = express.Router();

const {
  createprojectController,
  getNewProjects,
  updateStatudController,
  getSentToCEOProjects,
  getApprovedProjects,
  // getInvoiceProjects,
  // getProjectById,
  getDashboardController,
  getInvoiceProjects,
  getProjectById
} = require('../controllers/projectController');

const authMiddleware = require('../middleware/authMiddleware');
  
//router.use(authMiddleware); nahi to eesa karte ne sare router me chale jata meko indiviual dene ni need nahi padti jese mene niche diya hai 

router.post('/create',authMiddleware, createprojectController);
router.get('/new', authMiddleware, getNewProjects);
router.put('/update', authMiddleware, updateStatudController);
router.get('/sent-to-ceo', authMiddleware, getSentToCEOProjects);
router.get('/approved-by-client', authMiddleware, getApprovedProjects);
router.get('/invoice-raised', authMiddleware, getInvoiceProjects);
 router.get('/:id', authMiddleware, getProjectById);
router.get('/', authMiddleware, getDashboardController);

module.exports = router;
