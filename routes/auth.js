const express = require('express');
const { check,body } = require('express-validator/check');
const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post(
    '/login',
    [
      check('email')
        .isEmail()
        .withMessage('Please enter a valid email address.')
        .normalizeEmail(),
      body('password', 'Password has to be valid.')
        .isLength({ min: 5 })
        .isAlphanumeric()
        .trim()
    ],
    authController.postLogin
  );

router.post('/signup',
[ check('email').isEmail()
.withMessage('Please Enter A Valid Email Address')
.normalizeEmail()
.custom((value, { req }) => {
    // if(value === 'test@test.com'){
    //     throw new Error("This Email Is Forbidden");
    // }
    // return true;
     return User.findOne({ email: value }).then(userDoc => {
        if (userDoc) {
          return Promise.reject(
            'E-Mail exists already, please pick a different one.'
          );
        }
      });
  }),
  body('password',
        'Please Enter A Password Which Contains AlphaNumeric And Min. 6 Chars'
  )
  .isLength({ min:5 })
  .isAlphanumeric(),
  body('confirmPassword')
  .custom((value, {req}) => {
      if(value !== req.body.password){
          throw new Error('Password Has To Match');
      }
      return true;
  })

],
 authController.postSignup
 );

router.post('/logout', authController.postLogout);

router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword);
router.post('/updatepassword', authController.updatePassword);

module.exports = router;