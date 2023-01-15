const jwt = require('jsonwebtoken');
const SECRET_KEY = 'my-secret-key';

/** 해당 id의 회원정보들 */
exports.info = (ctx, next) => {
  let id = ctx.params.id;
  ctx.body = `${id} 회원에 대한 정보`;
}

exports.register = async (ctx, next) => {
  // 회원가입 처리 모듈
  
  let token = await generteToken({name: 'my-name'});
  ctx.body = token;
}
exports.login = async (ctx, next) => {
  // 로그인 모듈

  let token = await generteToken({name: 'my-name'});
  ctx.body = token;
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