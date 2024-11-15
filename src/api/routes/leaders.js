
const { getLeaders, getVerifiedLeaders, getLeaderById, postLeader, putLeader, deleteLeader } = require('../controllers/leaders');


const leadersRouter = require('express').Router();

leadersRouter.get('/id/:id', getLeaderById);
leadersRouter.get('/verified/', getVerifiedLeaders);
leadersRouter.get('/', getLeaders);
// leadersRouter.post('/', upload.single('image'), postLeader);
// leadersRouter.put('/:id', upload.single('image'), putLeader);
leadersRouter.delete('/:id', deleteLeader);

module.exports = leadersRouter;