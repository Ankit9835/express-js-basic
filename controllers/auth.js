const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator/check');
const User = require("../models/user");

const transport = nodemailer.createTransport(sendGridTransport({
  auth:{
    api_key: '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'
  }
}))


exports.getLogin = (req, res, next) => {
  //  const isloogedIn =  req
  //  .get('Cookie')
  //  .split(':')[0]
  //  .trim()
  //  .split('=')[1];
  //  console.log(isloogedIn);
  console.log(req.session.isloogedIn);
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  } else {
    message = null;
  }
    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage:message,
      oldInput: {
        email: '',
        password: ''
      },
      validationError:[]
    });
  };

  exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0){
      message = message[0];
    } else {
      message = null;
    }
    res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: message,
      oldInput:{
        email:"",
        password:"",
        confirmPassword:""
      },
      validationError:[]
    });
  };

  exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password
      },
      validationError: errors.array()
    });
  }
    User.findOne({ email: email })
    .then(user => {
      if(!user){
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationError: []
        });
      }
      bcrypt.compare(password, user.password)
      .then(doMatch => {
        if(doMatch){
         req.session.isloggedIn = true;
         req.session.user = user;
         return req.session.save(err => {
          console.log(err);
          res.redirect('/');
         })
        }
        return res.status(422).render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          errorMessage: 'Invalid email or password.',
          oldInput: {
            email: email,
            password: password
          },
          validationError: []
        });
      }).catch(err => {
        console.log(err);
      })
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    })
  };

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    console.log(errors.array());
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      errorMessage: errors.array()[0].msg,
      oldInput:{
        email: email,
        password:password,
        confirmPassword:req.body.confirmPassword
      },
      validationError:errors.array()
    });
  }

     bcrypt.hash(password, 12)
    .then(hashPassword => {
      const user = new User({
        email: email,
        password: hashPassword,
        cart: { items:[] }
      });
     return user.save();
    }).then((result) => {
    res.redirect('/login')
    return  transport.sendMail({
        to:email,
        from:'ankit@pitangent.com',
        subject:'Sign Up Succeded',
        html:'<h1> You SuccessFully Signed Up ! </h1>'
      })
    }).catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  } else {
    message = null;
  }
  res.render('auth/reset', {
    path: '/signup',
    pageTitle: 'Reset Password',
    errorMessage: message
  });
};

exports.postReset = (req,res,next) => {
  crypto.randomBytes(32, (err,buffer) => {
    if(err){
      console.log(err);
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email }).then(user => {
      if(!user){
        req.flash('error', 'This Email Address Is Not Linked Into Our Database');
        res.redirect('/reset');
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 360000;
      return user.save();
    }).then(result => {
      res.redirect(`/reset/${token}`);
    }).catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  })
}

exports.getNewPassword = (req, res, next) => {
  let message = req.flash('error');
  if(message.length > 0){
    message = message[0];
  } else {
    message = null;
  }
  const token = req.params.token;
  User.findOne({resetToken: token, resetTokenExpiration: {$gt: Date.now()}}).then(user => {
    res.render('auth/new-password', {
      path: '/signup',
      pageTitle: 'Update Password',
      errorMessage: message,
      userId: user._id.toString(),
      token:token
    });
  }).catch(err => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  })
  
};

exports.updatePassword = (req,res,next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.token;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId
  })
    .then(user => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPassword => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then(result => {
      res.redirect('/login');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });

}
  