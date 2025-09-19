const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const {
    createInventoryController,
    getInventoryController,
    getDonarsController,
    getHospitalController,
    getOrganizationController,
    getOrganizationForHospitalController,
    getInventoryHospitalController,
    getRecentInventoryController,
    getHospitalsForOrganizationController,
} = require('../controller/inventoryController');

const router = express.Router();

//routes
//ADD INVENTORY || POST
router.post('/create-inventory', authMiddleware, createInventoryController);

//GET ALL BLOOD RECORDS
router.get('/get-inventory', authMiddleware, getInventoryController);

//GET ALL BLOOD RECORDS
router.get('/get-recent-inventory', authMiddleware, getRecentInventoryController);

//GET HOSPITAL BLOOD RECORDS
router.post('/get-inventory-hospital', authMiddleware, getInventoryHospitalController);

//GET DONAR RECORDS
router.get('/get-donars', authMiddleware, getDonarsController);

//GET HOSPITAL RECORDS
router.get('/get-hospitals', authMiddleware, getHospitalController);

//GET ORGANIZATION RECORDS
router.get('/get-organization', authMiddleware, getOrganizationController);

//GET ORGANIZATION RECORDS FOR HOSPITAL
router.get('/get-organization-for-hospital', authMiddleware, getOrganizationForHospitalController);

//GET HOSPITAl RECORDS FOR ORGANIZATION
router.get('/get-hospitals-for-organization', authMiddleware, getHospitalsForOrganizationController);

module.exports = router;