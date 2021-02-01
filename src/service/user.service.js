const connection = require("../app/database"); 
class UserService {
  async create(user) {
    const {name,password} = user;
    const statement =  `insert into user (name,password) values(?,?)`;
    
    const result = await connection.execute(statement,[name,password]);
    return result[0];
  }

  async getUserByName(name){
    const statement = `select * from user where name = ?`;
    const result = await connection.execute(statement,[name]);
    return result[0];
  }
  async updateAvatarUrlById(avatarUrl, userId) {
    const statement = `update user set avatar_url = ? where id = ?`;
    const [result] = await connection.execute(statement, [avatarUrl, userId]);
    return result; 

  }
}

module.exports = new UserService();