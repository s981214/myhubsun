const connection = require("../app/database");
const sqlFragment = `
select 
      m.id id, m.content content, m.createAt createTime,m.updateAt updateTime,
      JSON_OBJECT('id',u.id, 'name', u.name) author
      from moment m
      left join user u
      on m.user_id = u.id
`;
class MomentService {
  async create(userId, content) {
    const statement = `insert into moment (content,user_id) values (?,?)`;
    const [result] = await connection.execute(statement,[content,userId]);
    return result;
  }
  async getMomentById(id) {
    const statement =  `
    select 
    m.id id, m.content content, m.createAt createTime,m.updateAt updateTime,
    JSON_OBJECT('id',u.id, 'name', u.name,'avatarUrl',u.avatar_url) author, 
    IF(count(l.id),JSON_ARRAYAGG(JSON_OBJECT('id',l.id,'name',l.name)),null) labels,
    (select if(count(c.id),JSON_ARRAYAGG(
    JSON_OBJECT('id',c.id,'content',c.content,'commentId',c.comment_id,'use',JSON_OBJECT('id',cu.id,'name',cu.name,'avatarUrl',cu.avatar_url))
    ),null) from comment c left join user cu on c.user_id = cu.id where m.id = c.moment_id) comments
    from moment m 
    left join user u on m.user_id = u.id
    left join moment_label ml on ml.moment_id = m.id
    left join label l on l.id = ml.label_id
    where m.id = ?
    GROUP BY m.id`
    ;
    const [result] = await connection.execute(statement,[id]);
    return result[0];
  }
  async getMomentList(offset,size) {
    const statement = 
    `
    select 
    m.id id, m.content content, m.createAt createTime,m.updateAt updateTime,
    JSON_OBJECT('id',u.id, 'name', u.name) author,
    (select count(*) from comment c where c.moment_id = m.id) commentCount,
    (select count(*) from moment_label ml where ml.moment_id = m.id) labelCount,
    (select JSON_ARRAYAGG(CONCAT('http://localhost:8000/moment/images/',file.filename)) from file where m.id = file.moment_id) images
    from moment m
    left join user u on m.user_id = u.id 
    LIMIT 0,10;
    `;
    const [result] = await connection.execute(statement,[offset,size]);
    return result;
  }
  async update(content, momentId) {
    const statement = `update moment set content = ? where id = ?
    `;
    const [result] = await connection.execute(statement,[content,momentId]);
    return result;

  }
  async remove(momentId) {
    const statement = `delete from moment where id = ?`;
    const [result] = await connection.execute(statement,[momentId]);
    return result;
  }
  async hasLabel(momentId, labelId) {
    const statement = `select * from moment_label where moment_id = ? and label_id = ?`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result[0] ? true : false;
  }
  async addLabel(momentId, labelId) {
    const statement = `insert into moment_label (moment_id, label_id) values(?,?)`;
    const [result] = await connection.execute(statement, [momentId, labelId]);
    return result;
  }
} 

module.exports = new MomentService();