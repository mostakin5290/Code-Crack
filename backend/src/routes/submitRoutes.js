const express = require('express');
const submitRoute = express.Router();
const userMiddleware = require("../middleware/userMiddleware");
const { 
    submitControllers, 
    runCode, 
    getSubmissionHistory, 
    getSubmissionById ,
    getAllSubmission
} = require("../controllers/submitControllers");

submitRoute.post('/submit/:id', userMiddleware, submitControllers);
submitRoute.post("/run/:id", userMiddleware, runCode);
submitRoute.get("/history/:id", userMiddleware, getSubmissionHistory);


submitRoute.get("/details/:submissionId", userMiddleware, getSubmissionById);
submitRoute.get("/getAll", userMiddleware, getAllSubmission);

module.exports = submitRoute;