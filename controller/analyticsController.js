const inventoryModel = require("../models/inventoryModel");
const mongoose = require('mongoose')

//GET BLOOD DATA
const bloodGroupDetailsController = async (req, res) => {
    try {

        const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB', 'O+', 'O-'];
        const bloodGroupData = []
        // const organization = new mongoose.Types.ObjectId(req.userId);
        const organization = new mongoose.Types.ObjectId(`${req.userId}`);


        // get single blood group
        await Promise.all(bloodGroups.map(async (bloodGroup) => {
            //Count Total IN
            const totalIn = await inventoryModel.aggregate([
                {
                    $match: {
                        bloodGroup: bloodGroup,
                        inventoryType: 'in',
                        organization,
                    },
                },
                {
                    $group: {
                        _id: null,
                        total: { $sum: '$quantity' },
                    }
                }
            ])
            //Count Total Out
            const totalOut = await inventoryModel.aggregate([
                {
                    $match: {
                        bloodGroup: bloodGroup,
                        inventoryType: 'out',
                        organization,
                    }
                },
                {
                    $group: {
                        _id: null, total: { $sum: '$quantity' }
                    }
                }
            ])
            //CALCULATE TOTAL
            const availableBlood = (totalIn[0]?.total || 0) - (totalOut[0]?.total || 0)

            //PUSH DATA
            bloodGroupData.push({
                bloodGroup,
                totalIn: totalIn[0]?.total || 0,
                totalOut: totalOut[0]?.total || 0,
                availableBlood
            })
        }))

        return res.status(200).send({
            success: true,
            message: "Blood Group Data Fetch Successfully",
            bloodGroupData,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Bloodgroup Data Analytics API",
            error: error.message || error
        })
    };
}
module.exports = { bloodGroupDetailsController }