const mongoose = require("mongoose")
const notificationSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: [
            "project_request",
            "project_request_accepted",
            "project_request_rejected",
            "connection_request",
            "connection_request_accepted",
            "project_invitation",
            "project_invitation_accepted",
            "message"
        ]
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Project"
    },
    referenceId: {
        type: mongoose.Schema.Types.ObjectId
    },
    message:{
        type: String
    },
    read:{
        type: Boolean,
        default: false
    },
},{timestamps:true})

module.exports = mongoose.model("Notification",notificationSchema)