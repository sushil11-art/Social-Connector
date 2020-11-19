const User = require("../models/User");
const dotenv = require("dotenv");
dotenv.config();

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
// const opts = {
//   jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("JWT"),
//   // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//   secretOrKey: process.env.TOKEN_SECRET
// };

// module.exports = passport => {
//   passport.use(
//     new JwtStrategy(opts, (jwt_payload, done) => {
//       console.log(jwt_payload._id);
//       User.findOne({id:jwt_payload.sub})
//         .then(user => {
//           if (user) {
//             return done(null, user);
//           } else {
//             return done(null, false);
//           }
//         })
//         .catch(error => console.log(error));
//     })
//   );

// };

const options = {};

options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
options.secretOrKey = process.env.TOKEN_SECRET;

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(options, (payload, done) => {
      User.findById({ id: payload._doc._id })
        .then((user) => {
          if (user) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        })
        .catch((error) => console.log(error));
    })
  );
};
