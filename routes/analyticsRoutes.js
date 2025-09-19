const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { bloodGroupDetailsController } = require('../controller/AnalyticsController');


const router = express.Router();

//routes


//GET BLOOD DATA RECORDS
router.get('/bloodGroups-data', authMiddleware, bloodGroupDetailsController);



module.exports = router;