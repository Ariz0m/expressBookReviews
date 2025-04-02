const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js');
const genl_routes = require('./router/general.js');

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}));

app.use("/customer/auth/*", function auth(req,res,next){
    const { token } = req.session.authorization;
    if (!token) return res.status(403).send('Invalid session.');
    jwt.verify(token, 'Messi', (err, user) => {
        if (err) return res.status(403).send('Invalid session.');
        req.user = user;
        next();
    });
});
 
const PORT = 3000;

app.use("/", genl_routes);
app.use("/customer", customer_routes);

app.listen(PORT,()=>console.log(`Server is running on port ${PORT}`));
