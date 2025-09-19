const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    inventoryType: {
        type: String,
        required: [true, 'inventory type require'],
        enum: ['in', 'out'],
    },
    bloodGroup: {
        type: String,
        required: [true, 'blood group is require'],
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB', 'O+', 'O-'],
    },
    quantity: {
        type: Number,
        required: [true, 'blood quantity is require'],
    },
    email: {
        type: String,
        required: [true, 'donar email is required'],
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'organization is require'],
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: function () {
            return this.inventoryType === 'out';
        }
    },
    donar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: function () {
            return this.inventoryType === 'in';
        },
    },
},
    { timestamps: true }
);

module.exports = mongoose.model('Inventory', inventorySchema);