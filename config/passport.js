const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const prisma = require('../prisma/client');

function initPassport(passport) {
  passport.use(new LocalStrategy({ usernameField: 'email' },async (email, password, done) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return done(null, false, { message: 'No user found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return done(null, false, { message: 'Wrong password' });

    return done(null, user);
  }));

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
}

module.exports = initPassport;
