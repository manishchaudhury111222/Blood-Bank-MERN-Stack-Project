const mongoose = require("mongoose");
const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");

// CREATE INVENTORY
const createInventoryController = async (req, res) => {
    try {
        const { email, inventoryType, bloodGroup, quantity, organization } = req.body;
        //validation
        const user = await userModel.findOne({ email });
        if (!user) {
            throw new Error("User Not Found");
        }
        // if (inventoryType === "in" && user.role !== "donar") {
        //   throw new Error("Not a donar account");
        // }
        // if (inventoryType === "out" && user.role !== "hospital") {
        //   throw new Error("Not a hospital");
        // }

        if (req.body.inventoryType == "out") {
            const requestedBloodGroup = req.body.bloodGroup;
            const requestedQuantityOfBlood = req.body.quantity;
            const organization = new mongoose.Types.ObjectId(`${req.userId}`);
            // const organization = new mongoose.Types.ObjectId(req.userId);

            const totalInOfRequestedBlood = await inventoryModel.aggregate([
                {
                    $match: {
                        organization,
                        inventoryType: "in",
                        bloodGroup: requestedBloodGroup,
                    },
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);
            // console.log("Total In", totalInOfRequestedBlood);
            const totalIn = totalInOfRequestedBlood[0]?.total || 0;
            //calculate OUT Blood Quanitity

            const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
                {
                    $match: {
                        organization,
                        inventoryType: "out",
                        bloodGroup: requestedBloodGroup,
                    },
                },
                {
                    $group: {
                        _id: "$bloodGroup",
                        total: { $sum: "$quantity" },
                    },
                },
            ]);
            const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

            //in & Out Calc
            const availableQuanityOfBloodGroup = totalIn - totalOut;
            //quantity validation
            if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
                return res.status(500).send({
                    success: false,
                    message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
                });
            }
            req.body.hospital = user?._id;
        } else {
            req.body.donar = user?._id;
        }

        //save record
        const inventory = new inventoryModel(req.body);
        await inventory.save();
        return res.status(201).send({
            success: true,
            message: "New Blood Record Added",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Create Inventory API",
            error,
        });
    }
};

// GET ALL BLOOD RECORS
const getInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel
            .find({
                organization: req.userId,
            })
            .populate("donar")
            .populate("hospital")
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            messaage: "get all records successfully",
            inventory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Get All Inventory",
            error,
        });
    }
};

// GET HOSPITAL BLOOD RECORS
const getInventoryHospitalController = async (req, res) => {
    try {
        const inventory = await inventoryModel
            .find(req.body.filters)
            .populate("donar")
            .populate("hospital")
            .populate("organization")
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            messaage: "get hospital consumer records successfully",
            inventory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Get consumer Inventory",
            error,
        });
    }
};

// GET BLOOD RECORD OF 3
const getRecentInventoryController = async (req, res) => {
    try {
        const inventory = await inventoryModel
            .find({
                organization: req.userId,
            })
            .limit(3)
            .sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            message: "recent Invenotry Data",
            inventory,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error In Recent Inventory API",
            error,
        });
    }
};

//GET DONAR RECORDS
const getDonarsController = async (req, res) => {
    try {
        const organization = req.userId
        //finds donars
        const donarId = await inventoryModel.distinct("donar", {
            organization,
        });
        // console.log(donarId);
        const donars = await userModel.find({ _id: { $in: donarId } })

        return res.status(200).send({
            success: true,
            message: "Donar Record Fetched Successfully",
            donars,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error in Donar records',
            error
        })

    }
};

//GET HOSPITAL RECORD
const getHospitalController = async (req, res) => {
    try {
        const organization = req.userId
        //GET HOSPITAL ID
        const hospitalId = await inventoryModel.distinct('hospital', { organization, });
        //FIND HOSPITAL
        const hospitals = await userModel.find({
            _id: { $in: hospitalId },
        });
        return res.status(200).send({
            success: true,
            message: "Hospitals Data Fetch Successfully",
            hospitals,
        });
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error In get Hospital API',
            error,
        })
    }
}

//GET ORG PROFILES
const getOrganizationController = async (req, res) => {
    try {
        const donar = req.userId
        const orgId = await inventoryModel.distinct('organization', { donar })
        //find org
        const organizations = await userModel.find({
            _id: { $in: orgId },
        });
        return res.status(200).send({
            success: true,
            message: "Org Data Fetch Successfully",
            organizations,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success: false,
            message: 'Error In ORG API',
            error
        })
    }
}



//GET ORG for Hospital
const getOrganizationForHospitalController = async (req, res) => {
    try {
        // Fetch all organizations
        const organizations = await userModel.find({ role: "organization" }).select(
            "organizationName name email phone address createdAt"
        );

        return res.status(200).send({
            success: true,
            message: "Organizations fetched successfully",
            organizations,
        });
    } catch (error) {
        console.error("Error in getOrganizationForHospitalController:", error);
        return res.status(500).send({
            success: false,
            message: "Error fetching organizations for hospital",
            error,
        });
    }
};



// const getOrganizationForHospitalController = async (req, res) => {
//     try {
//         // Convert hospital userId to ObjectId
//         const hospitalId = new mongoose.Types.ObjectId(req.userId);

//         // Find all organization IDs associated with this hospital
//         const orgIds = await inventoryModel.distinct("organization", { hospital: hospitalId });

//         console.log("Organization IDs linked to hospital:", orgIds);

//         // Handle case when no organizations are found
//         if (!orgIds || orgIds.length === 0) {
//             return res.status(200).send({
//                 success: true,
//                 message: "No organizations found for this hospital",
//                 organizations: [],
//             });
//         }

//         // Fetch organization details from userModel
//         const organizations = await userModel.find({ _id: { $in: orgIds } }).select(
//             "organizationName name email phone address createdAt"
//         );

//         return res.status(200).send({
//             success: true,
//             message: "Organizations fetched successfully for hospital",
//             organizations,
//         });
//     } catch (error) {
//         console.error("Error in getOrganizationForHospitalController:", error);
//         return res.status(500).send({
//             success: false,
//             message: "Error fetching organizations for hospital",
//             error,
//         });
//     }
// };


// const getOrganizationForHospitalController = async (req, res) => {
//     try {
//         // const hospital = new mongoose.Types.ObjectId(req.userId);
//         const hospital = req.userId;
//         const orgId = await inventoryModel.distinct('organization', { hospital })

//         console.log("Found Organization IDs for Hospital:", orgId);
//         //find org
//         const organizations = await userModel.find({
//             _id: { $in: orgId },
//         });
//         return res.status(200).send({
//             success: true,
//             message: "Hospital Org Data Fetch Successfully",
//             organizations,
//         })
//     } catch (error) {
//         console.log(error)
//         return res.status(500).send({
//             success: false,
//             message: 'Error In Hospital ORG API',
//             error
//         })
//     }
// }

// GET HOSPITALS FOR ORGANIZATION
const getHospitalsForOrganizationController = async (req, res) => {
    try {
        const organizationId = req.userId;

        const hospitalIds = await inventoryModel.distinct("hospital", {
            organization: organizationId,
            hospital: { $ne: null }
        });

        const hospitals = await userModel.find({
            _id: { $in: hospitalIds },
            role: "hospital"
        }).select("name email phone address createdAt");

        return res.status(200).send({ success: true, message: "Hospitals fetched", hospitals });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ success: false, message: "Error fetching hospitals", error });
    }
};





module.exports = { createInventoryController, getInventoryController, getDonarsController, getHospitalController, getOrganizationController, getOrganizationForHospitalController, getInventoryHospitalController, getRecentInventoryController, getHospitalsForOrganizationController };