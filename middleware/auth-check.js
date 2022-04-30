module.exports = (req, res, next) => {
    if(!req.session.isloggedIn){
        res.redirect('/login')
    }
    next();
}