const {Router} = require('express');

const authMiddleware = require('../middlewares/authMiddleware');
const stocksController = require('../controllers/stocksController');

const router = Router();

router.route('/quote').get(authMiddleware.ensureAuthenticated, stocksController.quoteGet).post(stocksController.quotePost);
router.route('/buy').get(authMiddleware.ensureAuthenticated, stocksController.buyGet).post(stocksController.buyPost);
router.route('/sell').get(authMiddleware.ensureAuthenticated, stocksController.sellGet).post(stocksController.sellPost);
router.route('/getStocks').get(authMiddleware.ensureAuthenticated, stocksController.getStocks);
router.route('/getPrice/:symbol').get(authMiddleware.ensureAuthenticated, stocksController.getPrice);
router.route('/history').get(authMiddleware.ensureAuthenticated, stocksController.historyGet);
router.route('/getTransactions').get(authMiddleware.ensureAuthenticated, stocksController.transactionsGet);


module.exports = router;