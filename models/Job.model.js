
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    comapanyName: {
        type: String,
        default: null,
    },
    position: {
        type: String,
        default: null,
    },
    contract: {
        type: String,
        enum: ["fullTime", "partTime"],
    },
    location: {
        type: String,
        default: null,
    },
    created_ts: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model("job", jobSchema)
