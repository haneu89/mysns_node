const { create, show } = require('./query');
const fs = require('fs')

/** 파일 업로드 */
exports.upload = async (ctx) => {
  let file = ctx.request.file;

  let { affectedRows, insertId } = await create(file.originalname, file.path, file.size);
  
  if(affectedRows > 0) {
    ctx.body = { result: "ok", id: insertId }
  } else {
    ctx.body = { result: "fail", }
  }
}
/** 파일 다운로드 */
exports.download = async ctx => {
  let { id } = ctx.params;
  
  let item = await show(id);
  
  if(item == null)  {
    ctx.body = {result: "fail"};
    return;
  }

  ctx.response.set("content-disposition", `attachment; filename=${item.original_name}`);
  ctx.statusCode = 200;
  ctx.body = fs.createReadStream(item.file_path);
}
