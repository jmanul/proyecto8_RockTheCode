
const { getLeaders, getVerifiedLeaders, getLeaderById, postLeader, putLeader, deleteLeader } = require('../controllers/leaders');


const leadersRouter = require('express').Router();

leadersRouter.get('/id/:id', getLeaderById);
leadersRouter.get('/verified/', getVerifiedLeaders);
leadersRouter.get('/', getLeaders);
leadersRouter.post('/', postLeader);
leadersRouter.put('/:id', putLeader);
leadersRouter.delete('/:id', deleteLeader);

module.exports = leadersRouter;