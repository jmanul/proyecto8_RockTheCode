
const { getStyles, getVerifiedStyles, getStyleById, postStyle, putStyle, deleteStyle } = require('../controllers/styles');

const stylesRouter = require('express').Router();

stylesRouter.get('/id/:id', getStyleById);
stylesRouter.get('/verified/', getVerifiedStyles);
stylesRouter.get('/', getStyles);
stylesRouter.post('/', postStyle);
stylesRouter.put('/:id', putStyle);
stylesRouter.delete('/:id', deleteStyle);

module.exports = stylesRouter;

