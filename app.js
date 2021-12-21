const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyparser.urlencoded({ extended:  false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin',adminRoutes);
app.use(shopRoutes);

app.use((req,res,send) => {
    res.status(404).sendFile(path.join(__dirname, 'views', 'pagenotfound.html'));
});

app.listen(3000);
