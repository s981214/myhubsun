const FileService = require("../service/file.service");
const userService = require("../service/user.service");
const {AVATAR_PATH} = require("../constants/file-path");

const {APP_PORT, APP_HOST} = require("../app/config");
class FileController {
  async saveAvatarInfo(ctx, next) {
    //获取图片相关信息
    const {filename, mimetype, size} = ctx.req.file;
    const {id}  = ctx.user;
    const result = await FileService.createAvatar(filename, mimetype, size, id);
    //将图片信息保存到user表中
    const avatarUrl = `${APP_HOST}:${APP_PORT}/users/${id}/avatar`;
    await userService.updateAvatarUrlById(avatarUrl,id);
    ctx.body = "上传头像成功";
    //2.将图像信息保存到数据库
  }
  async savePictureInfo(ctx, next) {
    //1.获取图像信息
    const files = ctx.req.files;
    const {id} = ctx.user;
    const {momentId} = ctx.request.query;
    console.log(momentId);
    //2.将所有的文件信息保存到数据库中
    for(let file of files) {
      const {filename, mimetype, size} = file;
      await FileService.createFile(filename, mimetype, size, id, momentId);
      
    }
    ctx.body = "动态配图上传完成";
    
  }
}

module.exports = new FileController();