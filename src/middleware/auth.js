const jwt = require('jsonwebtoken');

exports.verify = async (ctx, next) => {
  var token = ctx.request.headers['token']
  jwt.verify(token, process.env.APP_KEY, (error, decoded) => {
    if(error) {
      ctx.body = '로그인을 해야합니다';
      return;
    }
    next();
  })
}