
const { getLeaders, getLeaderById, postLeader, putLeader } = require('../controllers/leaders');


const leadersRouter = require('express').Router();

leadersRouter.get('/id/:id', getLeaderById);
//leadersRouter.get('/isVerified/:id');
leadersRouter.get('/', getLeaders);
leadersRouter.post('/', postLeader);
leadersRouter.put('/:id', putLeader);
//leadersRouter.delete('/:id');

module.exports = leadersRouter;