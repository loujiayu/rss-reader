var mongoose = require('mongoose');
var User = mongoose.model('User');

export function loadAuth(req) {
  console.log(req.session.user);
  return Promise.resolve(req.session.user || null);
}

export function login(req) {
  console.log('fapisfasipfnasinipnai');
  console.log(req);
  const {name, password} = req.body
  return new Promise((resolve, reject) => {
    User.findOne({nm: name}, (err, profile) => {
      if(!profile) {
        reject({message:"we can not find this account", status: 401})
      } else {
        console.log(name);
        if(profile.pw === password) {
          req.session.user = name
          console.log(name)
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
    User.findOne({nm:'ljy'}, (err, profile) => {
      if(!profile) {
        User.create(req.body)
        resolve(nm)
      } else {
        reject({message:"register error", status: 401})
      }
    })
    // User.create(req.body)
    // user.save((err) => {
    //   err ? reject({message:"register error", status: 401}) : resolve(nm)
    // })
  })
}
