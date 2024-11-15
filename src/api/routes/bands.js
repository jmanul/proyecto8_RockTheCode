
const upload = require('../../middleware/file');
const { postBand, getBands, getbandById, getVerifiedBands, putBand, deleteBand } = require('../controllers/bands');


const bandsRouter = require('express').Router();

bandsRouter.get('/id/:id', getbandById);
bandsRouter.get('/verified/', getVerifiedBands);
bandsRouter.get('/', getBands);
bandsRouter.post('/', upload.single('image'), postBand);
// bandsRouter.put('/:id', upload.single('image'), putBand);
bandsRouter.delete('/:id', deleteBand);

module.exports = bandsRouter;