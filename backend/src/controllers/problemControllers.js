const { getLanguageById, submitBatch, submitToken } = require('../utils/problemUtils');
const Problem = require('../models/problem');
const Submission = require('../models/submission')
const mongoose = require('mongoose');

/**
 * Creates a new problem after validating the reference solution.
 * The user creating the problem is identified by the adminMiddleware.
 */
const createProblem = async (req, res) => {

    try {

        const {
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            starterCode,
            referenceSolution
        } = req.body;

        if (referenceSolution && referenceSolution.length > 0) {
            for (const { language, completeCode } of referenceSolution) {
                if (!language || !completeCode) {
                    return res.status(400).send("Each reference solution must have a language and complete code.");
                }
                const languageId = getLanguageById(language);
                const submission = visibleTestCases.map((testcase) => ({
                    source_code: completeCode,
                    language_id: languageId,
                    stdin: testcase.input,
                    expected_output: testcase.output
                }));

                const submitResult = await submitBatch(submission);
                const resultToken = submitResult.map((value) => value.token);
                const testResult = await submitToken(resultToken);

                for (const test of testResult) {
                    if (test.status_id > 3) {
                        const failReason = `Reference solution for '${language}' failed. Reason: ${test.status.description}`;
                        return res.status(400).json({ message: failReason });
                    }
                }
            }
        }

        const problem = await Problem.create({
            title,
            description,
            difficulty,
            tags,
            visibleTestCases,
            hiddenTestCases,
            starterCode,
            referenceSolution,
            problemCreator: req.admin._id
        });


        res.status(201).json({ message: 'Problem created successfully', problem });
    }
    catch (err) {
        console.error("Error in createProblem:", err);
        if (err.name === 'ValidationError') {
            // This is a Mongoose validation error (e.g., a required field is missing)
            return res.status(400).json({ message: "Validation failed", error: err.message });
        }

        
        res.status(500).json({ message: "Error creating problem", error: err.message });
    }
};

/**
 * Updates an existing problem by its ID.
 */
const updateProblem = async (req, res) => {
    const { id } = req.params;

    // SECURITY: Explicitly list fields that can be updated to prevent mass assignment vulnerabilities.
    const updateData = {
        title: req.body.title,
        description: req.body.description,
        difficulty: req.body.difficulty,
        tags: req.body.tags,
        visibleTestCases: req.body.visibleTestCases,
        hiddenTestCases: req.body.hiddenTestCases,
        starterCode: req.body.starterCode,
        referenceSolution: req.body.referenceSolution
    };

    try {
        // FIX: The check for 'id' was sending a confusing "Invalid user" message.
        if (!id) {
            return res.status(400).json({ message: "Problem ID is required." });
        }

        // FIX: Added 'await' to ensure the problem is found before proceeding.
        const existingProblem = await Problem.findById(id);
        if (!existingProblem) {
            return res.status(404).json({ message: "Problem not found." });
        }

        // (Optional) You can add the same reference solution validation logic from createProblem here if you want.

        // FIX: Added 'await' to the update call. Using the secure 'updateData' object.
        const updatedProblem = await Problem.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        // BEST PRACTICE: Use status 200 for a successful update.
        res.status(200).json({ message: 'Problem updated successfully', problem: updatedProblem });

    } catch (err) {
        // BEST PRACTICE: Send a structured JSON error response.
        res.status(500).json({ message: 'Error updating problem', error: err.message });
    }
};

/**
 * Deletes a problem by its ID.
 */
const deleteProblem = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ message: 'Problem ID is required.' });
        }

        // FIX: This part was already good, just standardized the response.
        const deletedProblem = await Problem.findByIdAndDelete(id);

        if (!deletedProblem) {
            return res.status(404).json({ message: 'Problem not found.' });
        }

        // BEST PRACTICE: Send a consistent JSON response.
        res.status(200).json({ message: 'Problem deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: "Error deleting problem", error: err.message });
    }
};

/**
 * Retrieves a single, detailed problem by its ID.
 * NOTE: This route should be protected if it returns sensitive data like reference solutions.
 */
const getProblemById = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ message: "Invalid ID provided." });
        }

        // Cleaned up the 'select' statement.
        // WARNING: Be careful sending 'referenceSolution' to non-admin users.
        const problem = await Problem.findById(id).select(
            '_id title description difficulty tags visibleTestCases starterCode referenceSolution'
        );

        if (!problem) {
            return res.status(404).json({ message: "Problem not found." });
        }

        res.status(200).json(problem);
    } catch (err) {
        // FIX: Provided a proper error response instead of plain text.
        res.status(500).json({ message: 'Error fetching problem', error: err.message });
    }
};

/**
 * Retrieves a list of all problems with minimal details for a problem list page.
 */
// const getAllProblem = async (req, res) => {
//     try {
//         // This query is efficient for a list view.
//         const problems = await Problem.find({}).select('_id title difficulty tags');

//         // BEST PRACTICE: It's not an error if there are no problems. 
//         // Just return a 200 status with an empty array.
//         res.status(200).json(problems);
//     }
//     catch (err) {
//         res.status(500).json({ message: "Error fetching problems", error: err.message });
//     }
// };

const getAllProblem = async (req, res) => {
    try {
        // We need the user ID to personalize the status. The route should be protected.
        // If no user is logged in, we can treat userId as null.
        const userId = req.user ? new mongoose.Types.ObjectId(req.user._id) : null;

        // --- NEW: MongoDB Aggregation Pipeline ---
        const problems = await Problem.aggregate([
            // Stage 1: Lookup (join) with the submissions collection
            {
                $lookup: {
                    from: 'submissions', // The name of the submissions collection in MongoDB
                    localField: '_id',
                    foreignField: 'problemId',
                    as: 'submissions'
                }
            },
            // Stage 2: Add the new fields (status, acceptance)
            {
                $addFields: {
                    // Calculate user-specific status
                    status: {
                        $cond: {
                            if: { $eq: [userId, null] }, // If user is not logged in
                            then: 'none',
                            else: {
                                $let: {
                                    vars: {
                                        userSubmissions: {
                                            $filter: {
                                                input: '$submissions',
                                                as: 'sub',
                                                cond: { $eq: ['$$sub.userId', userId] }
                                            }
                                        }
                                    },
                                    in: {
                                        $cond: {
                                            if: { $anyElementTrue: [{ $map: { input: '$$userSubmissions', as: 's', in: { $eq: ['$$s.status', 'Accepted'] } } }] },
                                            then: 'solved',
                                            else: {
                                                $cond: {
                                                    if: { $gt: [{ $size: '$$userSubmissions' }, 0] },
                                                    then: 'attempted',
                                                    else: 'none'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    // Calculate overall acceptance rate
                    acceptance: {
                        $let: {
                            vars: {
                                totalAttempts: { $setUnion: '$submissions.userId' },
                                acceptedAttempts: {
                                    $setUnion: {
                                        $map: {
                                            input: { $filter: { input: '$submissions', as: 's', cond: { $eq: ['$$s.status', 'Accepted'] } } },
                                            as: 'sub',
                                            in: '$$sub.userId'
                                        }
                                    }
                                }
                            },
                            in: {
                                $cond: {
                                    if: { $eq: [{ $size: '$$totalAttempts' }, 0] },
                                    then: 0, // Avoid division by zero
                                    else: {
                                        $round: [
                                            { $multiply: [{ $divide: [{ $size: '$$acceptedAttempts' }, { $size: '$$totalAttempts' }] }, 100] },
                                            1 // Round to 1 decimal place
                                        ]
                                    }
                                }
                            }
                        }
                    }
                }
            },
            // Stage 3: Project (select) the final fields to send to the frontend
            {
                $project: {
                    _id: 1,
                    title: 1,
                    difficulty: 1,
                    tags: 1,
                    status: 1,
                    acceptance: 1
                }
            }
        ]);

        res.status(200).json(problems);
    }
    catch (err) {
        console.error("Aggregation Error in getAllProblem:", err);
        res.status(500).json({ message: "Error fetching problems", error: err.message });
    }
};

const getProblemByIdForAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        if (!id) {
            return res.status(400).json({ message: "Invalid ID provided." });
        }

        // ** THE FIX: Remove the .select() call to fetch all fields **
        // This will now include 'hiddenTestCases' and any other fields on the document.
        const problem = await Problem.findById(id);

        if (!problem) {
            return res.status(404).json({ message: "Problem not found." });
        }

        // Send the complete problem object
        res.status(200).json(problem);

    } catch (err) {
        res.status(500).json({ message: 'Error fetching problem', error: err.message });
    }
};

const searchProblems = async (req, res) => {
    try {
        const query = req.query.q || '';
        if (query.length < 2) {
            return res.json([]);
        }
        // Find problems where the title matches the query, case-insensitive
        const problems = await Problem.find({
            title: { $regex: query, $options: 'i' }
        }).select('title _id').limit(10); // Return only title and ID, limit to 10 results

        res.json(problems);
    } catch (error) {
        console.error('Problem search error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


module.exports = { 
    createProblem, 
    updateProblem, 
    deleteProblem, 
    getProblemById, 
    getAllProblem, 
    getProblemByIdForAdmin,
    searchProblems
};
