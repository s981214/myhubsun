const connections = require("../app/database");
class FileService {
  async createAvatar(filename, mimetype, size, userId) {
    const statement = `insert into avatar (filename, mimetype, size, user_id)
      values (?,?,?,?) `;
    const [result] = await connections.execute(statement,[filename, mimetype, size, userId]);
    return result;
  }

  async getAvatarByUserId(userId) {
    const statement = `select * from avatar where user_id = ?`;
    const [result] = await connections.execute(statement, [userId]);
    return result[0];
  }

  async createFile(filename, mimetype, size, userId, momentId) {
    const statement = `insert into file (filename, mimetype, size, user_id, moment_id)
    values (?,?,?,?,?) `;
    const [result] = await connections.execute(statement,[filename, mimetype, size, userId, momentId]);
    return result;
  }

  async getFileByFilename(filename) {
    const statement = `select * from file where filename = ?`;
    const [result] = await connections.execute(statement, [filename]);
    return result[0];
  }

}
module.exports = new FileService();