import request from 'superagent'
const access_token = 'AxnLXHDAkhHJ2L8e-7m0CqhXpmQUJOs8wK5a-WV33OVu4xUIKCv34VrUDeXFvh_o3s-sEyayOnqvZH_zGCsNpF_FojLLSkUJsVt55KQfJleIBd4bZjF4wRBvdmgyfF-vSe2Cs1gkw2aZXJKKxWO4oWRt16R90zuF3SxCLskYnX_FYRmIKRGYtxmrt0KfzjiAxlAa3tx7trcvVwRI_PfZMP3mrcQGYaBA'

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
