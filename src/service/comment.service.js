const connection = require("../app/database");
class CommentService {
  async create(momentId, content, userId) {
    const statement = `insert into comment (content, moment_id, user_id) values (?,?,?)`;
    const [result] = await connection.execute(statement,[content,momentId, userId]);
    return result;
  }
  async reply(momentId, content, userId, commentId) {
    const statement = `insert into comment (content, moment_id, user_id, comment_id) values (?,?,?,?)`;
    const [result] = await connection.execute(statement,[content, momentId, userId, commentId]);
    return result;
  }
  async update(commentId,content) {
    const statement = `update comment set content = ? where id = ?`;
    const [result] = await connection.execute(statement,[content, commentId]);
    return result; 
  }
  async remove(commentId) {
    const statement = `delete from comment where id = ?`;
    const [result] = await connection.execute(statement,[commentId]);
    return result;
  }
  async getCommentsByMomentId(momentId){
    const statement = `
    select m.id,m.content, m.comment_id commentId,
    JSON_OBJECT('id',u.id,'name',u.name) user
    from comment m
    left join user u on u.id = m.user_id
    where moment_id = ?
    `;
    const [result] = await connection.execute(statement,[momentId]);
    return result;
  }
}

module.exports = new CommentService();