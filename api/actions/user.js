var mongoose = require('mongoose');
var User = mongoose.model('User');

export function loadAuth(req) {
  console.log(req.session.user);
  return Promise.resolve(req.session.user || null);
}

export function login(req) {
  const {name, password} = req.body
  return new Promise((resolve, reject) => {
    User.findOne({nm: name}, (err, profile) => {
      if(err) {
        reject(err)
      } else {
        if(profile.pw === password) {
          req.session.user = name
          resolve(name)
        } else {
          reject('wrong password')
        }
      }
    })
  })
}

export function logout(req) {
  return new Promise((resolve) => {
    req.session.destroy(() => {
      req.session = null;
      return resolve(null);
    });
  });
}

export function register(req) {
  var user = new User(req.body)
  const {nm} = req.body
  return new Promise((resolve, reject) => {
    user.save((err) => {
      err ? reject(err) : resolve(nm)
    })
  })
}
