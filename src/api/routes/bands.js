
const { postBand, getBands, getbandById, getVerifiedBands, putBand, deleteBand } = require('../controllers/bands');


const bandsRouter = require('express').Router();

bandsRouter.get('/id/:id', getbandById);
bandsRouter.get('/verified/', getVerifiedBands);
bandsRouter.get('/', getBands);
bandsRouter.post('/', postBand);
bandsRouter.put('/:id', putBand);
bandsRouter.delete('/:id', deleteBand);

module.exports = bandsRouter;