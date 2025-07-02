require("dotenv").config()
const express = require('express')

const expressSession = require('express-session')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = require('./prisma/client')
const passport = require('passport');
const initPassport = require('./config/passport');
const bcrypt = require('bcryptjs');

const router = require('./routes/mainRouter')

const app = express()

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/',router)

app.use(
  expressSession({
    cookie: {
     maxAge: 7 * 24 * 60 * 60 * 1000 // ms
    },
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(
      prisma,
      {
        checkPeriod: 2 * 60 * 1000,  //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
      }
    )
	})
)

// Passport
initPassport(passport);
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT;
app.listen(PORT,()=>console.log(`Listening on PORT: ${PORT}`));