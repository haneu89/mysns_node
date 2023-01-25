const jwt = require('jsonwebtoken');
const query = require('./query');
const crypto = require('crypto');

var regmail = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

/** 해당 id의 회원정보들 */
exports.info = (ctx, next) => {
  let id = ctx.params.id;
  ctx.body = `${id} 회원에 대한 정보`;
}
 /** 회원 가입 */
exports.register = async (ctx, next) => {
  let { email, password, name } = ctx.request.body;

  let { count } = await query.find(email);

  if(!regmail.test(email)) {
    ctx.status = 400;
    ctx.body = {result: "fail", message: '올바른 이메일 형식을 지켜주세요'};
    return;
  }
  
  if(count > 0) {
    ctx.status = 400;
    ctx.body = {result: "fail", message: '중복된 이메일이 존재합니다.'};
    return;
  }

  let result = await crypto.pbkdf2Sync(password, process.env.APP_KEY, 50, 100, 'sha512')

  let { affectedRows, insertId } = await query.register(email, result.toString('base64'), name);

  if(affectedRows > 0) {
    let token = await generteToken({ name, id: insertId });
    ctx.body = {result: "success", token};
  } else {
    ctx.body = {result: "fail", message: '서버 오류'};
  }
}
/** 로그인 */
exports.login = async (ctx, next) => {
  let { email, password } = ctx.request.body;
  let result = await crypto.pbkdf2Sync(password, process.env.APP_KEY, 50, 100, 'sha512')
  
  let item = await query.login(email, result.toString('base64'));

  if(item == null) {
    ctx.body = {result: "fail", message: "아이디 혹은 비밀번호가 맞지 않습니다."};
  } else {
    let token = await generteToken({name: item.name, id: item.id });
    ctx.body = {result: "success", token};
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