/** 파일 업로드 */
exports.upload = ctx => {
  let file = ctx.request.file;
  ctx.body = file;
}
