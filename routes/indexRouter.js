const { Router } = require('express');

const indexController = require('../controllers/indexController');
const authController = require('../controllers/authController');

const authMiddleware = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', authMiddleware.ensureAuthenticated, indexController.indexGet);

router
  .route('/login')
  .get(authController.loginGet)
  .post(authController.loginPost);

router.get('/logout', authController.logout);

router
  .route('/register')
  .get(authController.registerGet)
  .post(authController.registerPost);

module.exports = router;
