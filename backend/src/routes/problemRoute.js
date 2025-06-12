const express = require('express');

const problemRouter = express.Router();
const {createProblem,updateProblem,deleteProblem,getProblemById,getAllProblem,getProblemByIdForAdmin,searchProblems} = require('../controllers/problemControllers');
const adminMiddleware = require('../middleware/adminMiddleware');
const userMiddleware = require('../middleware/userMiddleware')

problemRouter.post('/create',adminMiddleware,createProblem);
problemRouter.put('/update/:id',adminMiddleware,updateProblem);
problemRouter.delete('/delete/:id',adminMiddleware,deleteProblem);

problemRouter.get('/problemById/:id',userMiddleware,getProblemById);
problemRouter.get('/getAllProblem',userMiddleware,getAllProblem);
problemRouter.get('/problemByIdForAdmin/:id',adminMiddleware,getProblemByIdForAdmin);

problemRouter.get('/search',userMiddleware,searchProblems);


module.exports = problemRouter; 