exports.PageNotFound = (req,res,send) => {
    res.status(404).render('404', {pageTitle: '404 Page', path: '/404-page'});
};