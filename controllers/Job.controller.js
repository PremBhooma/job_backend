const Job = require("../models/Job.model");

exports.createJob = async (req, res) => {
    try {
        let { comapanyName, position, contract, location } = req.body;

        let newJob = new Job({
            comapanyName,
            position,
            contract,
            location,
        });
        newJob = await newJob.save();

        return res.status(201).json({
            errorcode: 0,
            status: true,
            message: "Job Created Successfully",
            data: newJob,
        });
    } catch (error) {
        return res.status(500).json({
            errorcode: 5,
            status: false,
            message: error.message,
            data: error,
        });
    }
};

exports.getAllJob = async (req, res) => {
    try {
        let getData = await Job.find({}).sort({ created_ts: -1 });
        return res.status(200).json({
            errorcode: 0,
            status: true,
            message: "Get All Jobs Successfully",
            data: getData,
        });
    } catch (error) {
        return res.status(500).json({
            errorcode: 5,
            status: false,
            message: error.message,
            data: error,
        });
    }
};

exports.updateJob = async (req, res) => {
    try {
        let { id, comapanyName, position, contract, location } = req.body;
        if (!id) {
            return res.status(207).json({
                errorcode: 1,
                status: false,
                message: "Id Should Be Present",
            });
        }
        let updateJob = await Job.findById({ _id: id });
        if (!updateJob)
            return res.status(207).json({
                errorcode: 2,
                status: false,
                message: "Job Not Found",
                data: null,
            });

        updateJob.comapanyName = comapanyName ? comapanyName : updateJob.comapanyName;
        updateJob.position = position ? position : updateJob.position;
        updateJob.contract = contract ? contract : updateJob.contract;
        updateJob.location = location ? location : updateJob.location;

        await updateJob.save();

        return res.status(200).json({
            errorcode: 0,
            status: false,
            message: "Job Updated Successfully",
            data: updateJob,
        });
    } catch (error) {
        return res.status(500).json({
            errorcode: 5,
            status: false,
            message: error.message,
            data: error,
        });
    }
};

exports.deleteJob = async (req, res) => {
    try {
        let { id } = req.params;
        if (!id) {
            return res.status(404).json({
                errorcode: 1,
                status: false,
                messsage: "Id shoud Be Present",
                data: null,
            });
        }
        let delJob = await Job.findById({ _id: id });
        if (!delJob) {
            return res.status(207).json({
                errorcode: 2,
                status: false,
                message: "Job Is Not Found",
                data: null,
            });
        }
        await Job.deleteOne({ _id: id });
        return res.status(200).json({
            errorcode: 0,
            status: true,
            message: "Job Deleted Successfully",
            data: null,
        });
    } catch (error) {
        return res.status(500).json({
            errorcode: 5,
            status: false,
            message: error.message,
            date: error,
        });
    }
};