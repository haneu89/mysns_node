const { pool } = require('../../data')

exports.index = async () => {
  const query = `SELECT feed.*, u.name user_name, image_id FROM feed 
  LEFT JOIN user u on u.id = feed.user_id 
  LEFT JOIN files f on feed.image_id = f.id
  ORDER BY feed.id DESC`
  return await pool(query);
}
exports.create = async (user, image, content) => {
  const query = `INSERT INTO feed 
  (user_id, image_id, content)
  VALUES (?,?,?)`;
  return await pool(query, [user, image, content]);
}
exports.show = async (id) => {
  const query = `SELECT feed.*, u.name user_name, image_id FROM feed 
  LEFT JOIN user u on u.id = feed.user_id 
  LEFT JOIN files f on feed.image_id = f.id
  WHERE feed.id = ?`
  let result = await pool(query, [id]);
  return (result.length < 0) ? null : result[0];
}
exports.update = async (content, id) => {
  const query = `UPDATE feed SET content = ? WHERE id = ?`;
  return await pool(query, [content, id]);
}
exports.delete = async id => {
  return await pool(`DELETE FROM feed WHERE id = ?`, [id]);
  
}