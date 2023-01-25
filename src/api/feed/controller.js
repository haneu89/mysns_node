const query = require('./query');
/** 전체 피드보기 */
exports.index = async (ctx, next) => {
  let items = await query.index();
  ctx.body = items;
}
/** 새 피드 작성 처리 */
exports.store = async (ctx, next) => {
  let body = ctx.request.body
  let user = ctx.request.user;

  let result = await query.create(user.id, body.image_id, body.content);

  if(result.affectedRows > 0) {
    ctx.body = { result: "ok", id: result.insertId }
  } else {
    ctx.body = { result: "fail", }
  }
}
/** 피드 상세보기 */
exports.show = async (ctx, next) => {
  let id = ctx.params.id;
  let user = ctx.request.user;

  let item = await query.show(id);
  item['is_me'] = (user.id === item.user_id);

  ctx.body = item;
}
/** 피드 수정 */
exports.update = async (ctx, next) => {
  let body = ctx.request.body
  let id = ctx.params.id;

  let user = ctx.request.user;
  let item = await query.show(id);

  if(user.id !== item.user_id) {
    ctx.status = 400;
    ctx.body = {result: "fail", message: '타인의 글은 수정할 수 없습니다.'};
    return;
  }
  
  let result = await query.update(body.content, id);

  if(result.affectedRows > 0) {
    ctx.body = { result: "ok", id }
  } else {
    ctx.body = { result: "fail", }
  }
}
/** 피드 삭제 */
exports.delete = async (ctx, next) => {
  let user = ctx.request.user;
  let id = ctx.params.id;

  let item = await query.show(id);

  if(user.id !== item.user_id) {
    ctx.status = 400;
    ctx.body = {result: "fail", message: '타인의 글은 삭제할 수 없습니다.'};
    return;
  }
  let result = await query.delete(id);
  
  if(result.affectedRows > 0) {
    ctx.body = { result: "ok", id }
  } else {
    ctx.body = { result: "fail", }
  }
}