import request from 'superagent'
const access_token = 'A3VSXl-aIrjukz-vVW4PD0yYThsRxgPVNk3-s04mtTjbqlKJx2WdKjMkRhZkPR773g4Vxi2RUAWnqXmY5U0DEsNRJXbQo66pGl2H8u5KgFrsUOoBehgMMOLiJ_GHrO_f6s60Ie1tH9lW8e-lIn2gREvqZG7cZzI9dIXvg2SOBUYEf0kdtDFY9gZuHaATiWcq_uA8cdJEOj8HodNCfGvHgfwxWtVJniM:sandbox'

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
