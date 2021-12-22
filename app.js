const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const expressHbs = require('express-handlebars');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.engine(
  'hbs',
  expressHbs({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main-layout',
    extname: 'hbs'
  })
);
app.set('view engine', 'hbs');
app.set('views', 'views');
// app.set('view engine', 'pug');
// app.set('views', 'views');

app.use(bodyparser.urlencoded({ extended:  false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin',adminRoutes.routes);
app.use(shopRoutes);

app.use((req,res,send) => {
    res.status(404).render('404', {pageTitle: '404 Page'});
});

app.listen(3000);
