const Problem = require("../models/problem");
const Submission = require("../models/submission");
const { getLanguageById, submitBatch, submitToken } = require("../utils/problemUtils");

// (This function seems correct, no changes needed here)
const buildDriverCode = (userCode, language) => {
    if (language === 'javascript') {
        const functionNameMatch = userCode.match(/(?:var|let|const|function)\s+([a-zA-Z0-9_]+)\s*=/);
        if (!functionNameMatch) {
            const arrowMatch = userCode.match(/(?:var|let|const)\s+([a-zA-Z0-9_]+)\s*=\s*\(/);
            if (!arrowMatch) return userCode; // Fallback if no function name can be found
            const functionName = arrowMatch[1];
            return `
                ${userCode}
                const fs = require('fs');
                try {
                    const inputJson = fs.readFileSync(0, 'utf-8');
                    const parsedInput = JSON.parse(inputJson);
                    const args = Array.isArray(parsedInput) ? parsedInput : Object.values(parsedInput);
                    const result = ${functionName}(...args);
                    console.log(JSON.stringify(result));
                } catch (e) {}
            `;
        }
        const functionName = functionNameMatch[1];
        return `
            ${userCode}
            const fs = require('fs');
            try {
                const inputJson = fs.readFileSync(0, 'utf-8');
                const parsedInput = JSON.parse(inputJson);
                const args = Array.isArray(parsedInput) ? parsedInput : Object.values(parsedInput);
                const result = ${functionName}(...args);
                console.log(JSON.stringify(result));
            } catch (e) {}
        `;
    }
    return userCode;
};


// --- CORRECTED runCode FUNCTION ---
const runCode = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: problemId } = req.params;
        const { code, language } = req.body;

        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ message: 'Problem not found.' });

        const languageId = getLanguageById(language);
        if (!languageId) return res.status(400).json({ message: `Language '${language}' is not supported.` });

        const runnableCode = buildDriverCode(code, language);

        const submissionPayload = problem.hiddenTestCases.map((testcase) => ({
            source_code: runnableCode,
            language_id: languageId,
            stdin: JSON.stringify(testcase.input),
            expected_output: JSON.stringify(testcase.output),
        }));

        const batchResponse = await submitBatch(submissionPayload);
        if (!batchResponse) throw new Error("Submission to execution engine failed.");

        const tokens = batchResponse.map((r) => r.token);
        const results = await submitToken(tokens);

        let finalStatus = 'Accepted', passedCount = 0, finalErrorMessage = null, totalRuntime = 0, maxMemory = 0;
        const detailedTestCases = [];

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const testCase = problem.hiddenTestCases[i];

            totalRuntime += parseFloat(result.time || 0);
            maxMemory = Math.max(maxMemory, result.memory || 0);
            const passed = result.status.id === 3;
            if (passed) passedCount++;

            let actualOutput;
            try {
                // Safety Improvement: Only parse if stdout exists and is valid JSON.
                actualOutput = result.stdout ? JSON.parse(result.stdout) : result.stderr || "No output";
            } catch (e) {
                // If parsing fails, it's a raw string output.
                actualOutput = result.stdout;
            }

            detailedTestCases.push({
                passed: passed,
                runtime: result.time,
                input: testCase.input,
                output: actualOutput,
                expected: testCase.output,
            });

            if (!passed && finalStatus === 'Accepted') {
                finalStatus = result.status.description;
                finalErrorMessage = result.stderr || result.compile_output || 'The output did not match the expected value.';
            }
        }

        res.status(201).json({
            status: finalStatus, errorMessage: finalErrorMessage,
            passed: passedCount, total: problem.hiddenTestCases.length,
            runtime: `${totalRuntime.toFixed(3)}s`, memory: `${maxMemory} KB`,
            testCases: detailedTestCases
        });

    } catch (err) {
        console.error('Run Code Error:', err);
        res.status(500).json({
            success: false,
            message: "An internal server error occurred while running the code.",
            error: err.message
        });
    }
};


// --- submitControllers function (with a small safety improvement) ---
const submitControllers = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: problemId } = req.params;
        const { code, language } = req.body;

        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ message: 'Problem not found.' });

        const languageId = getLanguageById(language);
        if (!languageId) return res.status(400).json({ message: `Language '${language}' is not supported.` });

        const runnableCode = buildDriverCode(code, language);

        const submissionPayload = problem.hiddenTestCases.map((testcase) => ({
            source_code: runnableCode,
            language_id: languageId,
            stdin: JSON.stringify(testcase.input),
            expected_output: JSON.stringify(testcase.output),
        }));

        const batchResponse = await submitBatch(submissionPayload);
        if (!batchResponse) throw new Error("Submission to execution engine failed.");

        const tokens = batchResponse.map((r) => r.token);
        const results = await submitToken(tokens);

        let finalStatus = 'Accepted', passedCount = 0, finalErrorMessage = null, totalRuntime = 0, maxMemory = 0;
        const detailedTestCases = [];

        for (let i = 0; i < results.length; i++) {
            const result = results[i];
            const testCase = problem.hiddenTestCases[i];

            totalRuntime += parseFloat(result.time || 0);
            maxMemory = Math.max(maxMemory, result.memory || 0);
            const passed = result.status.id === 3;
            if (passed) passedCount++;

            let actualOutput;
            try {
                // Safety Improvement: Only parse if stdout exists and is valid JSON.
                actualOutput = result.stdout ? JSON.parse(result.stdout) : result.stderr || "No output";
            } catch (e) {
                // If parsing fails, it's a raw string output.
                actualOutput = result.stdout;
            }

            detailedTestCases.push({
                passed: passed,
                runtime: result.time,
                input: testCase.input,
                output: actualOutput,
                expected: testCase.output,
            });

            if (!passed && finalStatus === 'Accepted') {
                finalStatus = result.status.description;
                finalErrorMessage = result.stderr || result.compile_output || 'The output did not match the expected value.';
            }
        }

        const submissionRecord = await Submission.create({
            userId, problemId, code, language, status: finalStatus,
            testCasesPassed: passedCount, testCasesTotal: problem.hiddenTestCases.length,
            errorMessage: finalErrorMessage, runtime: totalRuntime.toFixed(3), memory: maxMemory,
        });

        res.status(201).json({
            id: submissionRecord._id, status: finalStatus, errorMessage: finalErrorMessage,
            passed: passedCount, total: problem.hiddenTestCases.length,
            runtime: `${totalRuntime.toFixed(3)}s`, memory: `${maxMemory} KB`,
            testCases: detailedTestCases
        });

    } catch (err) {
        console.error('Submission Error:', err);
        res.status(500).json({ message: 'An internal server error occurred during submission.', error: err.message });
    }
};


const getSubmissionHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const { id: problemId } = req.params;

        // Fetch all necessary fields, remove .select()
        const submissions = await Submission.find({ userId, problemId })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean(); // Use .lean() for better performance on read-only operations

        // Map the results to a formatted structure
        const formattedSubmissions = submissions.map(sub => ({
            _id: sub._id,
            status: sub.status,
            language: sub.language,
            createdAt: sub.createdAt,
            runtime: sub.runtime ? `${sub.runtime.toFixed(3)}s` : null,
            memory: sub.memory ? `${sub.memory} KB` : null,
        }));

        res.status(200).json(formattedSubmissions);

    } catch (err) {
        console.error('Get History Error:', err);
        res.status(500).json({ message: 'Failed to fetch submission history.', error: err.message });
    }
};

const getSubmissionById = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const submission = await Submission.findOne({ _id: submissionId, userId: req.user._id });

        if (!submission) {
            return res.status(404).json({ message: "Submission not found or you do not have permission to view it." });
        }

        // Format the database record to match the structure expected by the frontend's SubmissionResultDetails component
        const formattedResult = {
            id: submission._id,
            status: submission.status,
            errorMessage: submission.errorMessage,
            passed: submission.testCasesPassed,
            total: submission.testCasesTotal,
            runtime: `${submission.runtime.toFixed(3)}s`,
            memory: `${submission.memory} KB`,
            testCases: [] // NOTE: We don't store individual test case results, so this will be empty for historical views.
        };

        res.status(200).json({
            result: formattedResult,
            code: submission.code,
            language: submission.language
        });

    } catch (err) {
        console.error('Get Submission By ID Error:', err);
        res.status(500).json({ message: 'Failed to fetch submission details.', error: err.message });
    }
};

const getAllSubmission = async (req, res) => {
    try {
        const userId = req.query.userId || req.user._id;
        const submissions = await Submission.find({ userId: userId })
            .sort({ createdAt: -1 }) 
            .populate('problemId', 'title');

        if (!submissions.length) {
            return res.status(404).json({ message: "No submissions found." });
        }

        // Map and format all submissions
        const formattedResults = submissions.map(sub => {
            const problemTitle = sub.problemId ? sub.problemId.title : "Deleted Problem";
            return {
                id: sub._id,
                problemId: sub.problemId ? sub.problemId._id : null,
                status: sub.status,
                title: problemTitle, // <-- Now this is the correct title string!
                errorMessage: sub.errorMessage,
                total: sub.testCasesTotal,
                createdAt: sub.createdAt,
            };
        });


        res.status(200).json({ results: formattedResults });

    } catch (err) {
        console.error('Get All Submissions Error:', err);
        res.status(500).json({ message: 'Failed to fetch submissions.', error: err.message });
    }
};


module.exports = { getSubmissionById, submitControllers, runCode, getSubmissionHistory, getAllSubmission };