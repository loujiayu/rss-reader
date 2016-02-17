import request from 'superagent'
const access_token = 'AzepBSVkqpwOvjrLhP0XwZFiJy36eLZnMnhrnykT3BYOHV_BYxRZuqjzGNLKvqV7GB1C1YYPYV83oofhyjXoLhfWhzIa4vGNRiXbboul0dAWxl_Mv7Xkc_33KLSsbITnpdwPEKLXagcB95vZx3UJSqbUVfUHhYZ7pmy5Y6jFy5N08ki0sG7Llv0hRt6M-CcG8YcY-EgaSnyWQi2DgPnmEnTRWKdDQqSe:sandbox'

export function search(req, params) {
  return new Promise((resolve, reject) => {
    console.log(req.query);
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
