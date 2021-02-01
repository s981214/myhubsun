const errorTypes = require("../constants/error-types");
const service = require("../service/user.service");
const md5password = require("../utils/password-handle");
const verifyUser = async (ctx, next) => {
  //1.获取用户名和密码
  const {name,password} = ctx.request.body;
  //2.判断用户名或者密码不能为空
  if(!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error",error,ctx);
  } 
  //3.判断这次注册的用户名是否没有注册
  const result = await service.getUserByName(name);

  if(result.length) {
    const error = new Error(errorTypes.USER_ALREADY_EXISTS);
    return ctx.app.emit("error",error,ctx);
  }


  await next();
}
const handlePassword = async(ctx,next) => {
  const {password} = ctx.request.body;
  // 对密码进行处理
  ctx.request.body.password = md5password(password);
  await next();

}

module.exports = {
  verifyUser,
  handlePassword
}