const fs = require("fs");

const UserService = require("../service/user.service");
const fileService = require("../service/file.service");
const {AVATAR_PATH} = require("../constants/file-path");
class UserController {
  async create(ctx,next) {
    const user = ctx.request.body;
    const result = await UserService.create(user);
    ctx.body = result;
  }
  async avatarInfo(ctx, next) {
    const {userId} = ctx.params;
    console.log(userId);
    const avatarInfo = await fileService.getAvatarByUserId(userId);
    ctx.response.set("content-type", avatarInfo.mimetype);
    //提供图像信息
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${avatarInfo.filename}`);
  }
}

module.exports = new UserController();