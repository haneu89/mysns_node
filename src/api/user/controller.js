const jwt = require('jsonwebtoken');
const { register, login } = require('./query');
const crypto = require('crypto');


/** 해당 id의 회원정보들 */
exports.info = (ctx, next) => {
  let id = ctx.params.id;
  ctx.body = `${id} 회원에 대한 정보`;
}
 /** 회원 가입 */
exports.register = async (ctx, next) => {
  let { email, password, name } = ctx.request.body;
  let result = crypto.pbkdf2Sync(password, process.env.APP_KEY, 50, 255, 'sha512')

  let { affectedRows } = await register(email, result.toString('base64'), name);

  if(affectedRows > 0) {
    let token = await generteToken({ name });
    ctx.body = token;
  } else {
    ctx.body = {result: "fail"};
  }
}
/** 로그인 */
exports.login = async (ctx, next) => {
  let { email, password } = ctx.request.body;
  let result = crypto.pbkdf2Sync(password, process.env.APP_KEY, 50, 255, 'sha512')
  
  let item = await login(email, result.toString('base64'));

  if(item == null) {
    ctx.body = {result: "fail"};
  } else {
    let token = await generteToken({name: item.name});
    ctx.body = token;
  }
}
/**
 * jwt 토큰 생성
 * @param {object} payload 추가적으로 저장할 payload
 * @returns {string} jwt 토큰string
 */
let generteToken = (payload) => {
  return new Promise((resolve, reject) => {
     jwt.sign(payload, process.env.APP_KEY, (error, token) => {
      if(error) { reject(error); }
      resolve(token);
     })
  })
}