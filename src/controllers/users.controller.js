const usersCtrl ={};

const passport = require('passport');

// const user = require('../models/User')
const User = require('../models/User')
usersCtrl.renderSignUpForm = (req, res) => {
    res.render('users/signup');
};

usersCtrl.signup = async (req,res) => {
    const errors = [];
    const {name, email, password, confirm_password, matricula, endereco, escola} = req.body; 
    if (password != confirm_password) {
        errors.push({text: 'Passwords do not match'});
}

    if (password.length < 4) {
        errors.push({text: 'Passwords must be at least 4 characters.'});
    }

    if (errors.length > 0) {
    res.render('users/signup', {
        errors,
        name,
        email,
        matricula,
        endereco,
        escola
    }); 
    } else {
        const emailUser = await User.findOne({email: email});
        if (emailUser){
            req.flash('error_msg', 'O email ja esta cadastrado.');
            res.redirect('/users/signup');
        } else {
            const newUser = new User({name, email, password, matricula, endereco, escola});
            newUser.password = await newUser.encryptPassword(password)
            await newUser.save();
            req.flash('success_msg', 'Voce foi cadastrado com sucesso');
            res.redirect('/users/signin')
        }
    };
}
usersCtrl.renderSigninForm = (req, res) => {
    res.render('users/signin')
};

usersCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/users/signin',
    successRedirect: '/',
    failureFlash: true
})

usersCtrl.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', 'Você saiu com sucesso');
        res.redirect('/users/signin');
    });
};

module.exports = usersCtrl;