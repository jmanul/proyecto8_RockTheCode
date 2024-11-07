
const { getLeaders, getLeaderById, postLeader } = require('../controllers/leaders');


const leadersRouter = require('express').Router();

leadersRouter.get('/id/:id', getLeaderById);
//leadersRouter.get('/isVerified/:id');
leadersRouter.get('/', getLeaders);
leadersRouter.post('/', postLeader);
//leadersRouter.put('/:id');
//leadersRouter.delete('/:id');

module.exports = leadersRouter;