import request from 'superagent'
const access_token = 'A3q8IovwlwdBHz413omUSTLM7yrSpRqKkSSHufiJsvveBgeno1j978QlnBAkhuKFySyFP8TwB-KLKTcRIS7g599-rxkE8uZxVY2PCHMierorbFLWwps-GpisG21-eAdP1YKYd7j97rcRGYklNxqX76_MwnAjrlxQjZ79zv9kIo_CVo-65Po8ld8PeZdbklItjVtIrGIZOqTgCdc39p-QBQzndunp5tE3:sandbox'

export function search(req, params) {
  return new Promise((resolve, reject) => {
    request.get(`https://sandbox.feedly.com/v3/search/feeds`)
        .query(req.query)
        .set('Authorization', 'OAuth '+ access_token)
        .end((err, {body} = {}) => err ? reject(err) : resolve(body))
      })
}

export function stream(req, params) {
  return new Promise((resolve, reject) => {
    request.get(`https://sandbox.feedly.com/v3/streams/contents`)
        .query(req.query)
        .set('Authorization', 'OAuth '+ access_token)
        .end((err, {body} = {}) => err ? reject(body || err) : resolve(body))
      })
}
