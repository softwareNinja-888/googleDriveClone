require("dotenv").config();
const express = require('express');
const expressSession = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./prisma/client');
const passport = require('passport');
const initPassport = require('./config/passport');
const router = require('./routes/mainRouter');
const bcrypt = require('bcryptjs');


const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// Session middleware (must come before passport.session())
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
    }),
  })
);

// Passport setup
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.user = req.user || null; 
  next();
});

// ✅ Routes must be mounted AFTER passport + session
app.use('/', router);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
