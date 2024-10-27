const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(new LocalStrategy({ 
    usernameField: 'email', 
    passwordField: 'password'
}, async (email, password, done) => {

    // Match Email's user
    const user = await User.findOne({email}) 
    if (!user) {
        return done(null, false, { message: 'O usuario nao existe'});
    } else {
    // Senha correta
        const match = await user.matchPassword(password);
        if(match){
            return done(null, user);
        } else{
            return done(null, false, {message: 'Senha Incorreta'});
        }
    }

}));
passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Remove o callback e usa `await`
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});