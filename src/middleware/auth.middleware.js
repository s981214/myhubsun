const jwt = require("jsonwebtoken");

const errorTypes = require("../constants/error-types");
const userService = require("../service/user.service");
const md5password = require("../utils/password-handle");
const AuthService = require("../service/auth.service");
const {PUBLIC_KEY} = require("../app/config");
const verifyLogin = async(ctx, next) => {
  //获取用户名和密码 
  const {name,password} = ctx.request.body;
  //判断用户名和密码是否为空
  if(!name || !password) {
    const error = new Error(errorTypes.NAME_OR_PASSWORD_IS_REQUIRED);
    return ctx.app.emit("error",error,ctx);
  } 
  //3.判断这次注册的用户名是否没有注册


  const result = await userService.getUserByName(name);
  const user = result[0];

  if(!user) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS);
    return ctx.app.emit("error",error,ctx) ;
  }
  //判断密码是否和数据库中密码一致
  if(md5password(password) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT);
    return ctx.app.emit("error",error,ctx) ;
  }
  ctx.user = user;
  await next();
};
const verifyAuth = async (ctx,next) => {
  console.log("验证授权的middleware ");
  // 获取token 
  console.log(ctx.headers);
  const authorization = ctx.headers.authorization;
  if(!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION);
    return ctx.app.emit("error",error,ctx);
    
  }
  const token = authorization.replace("Bearer ","");
  console.log(token); 
  //验证token
  try {
    const result = jwt.verify(token,PUBLIC_KEY, {
      algorithms: ["RS256"]
    });
    ctx.user = result;
    console.log(result);
    await next();
  } catch (error) {
    const error1 = new Error(errorTypes.UNAUTHORIZATION);
    ctx.app.emit("error",error1,ctx);
  }
}
const verifyPermission = async (ctx, next) => {
  console.log("验证权限的middleware");
  //1.获取参数
  const [resourceKey] = Object.keys(ctx.params);
  const tableName = resourceKey.replace("Id","");
  const resoureId = ctx.params[resourceKey];
  const {id} = ctx.user;
  //2.查询是否具备权限
 try {
  const isPermission = await AuthService.checkResource(tableName,resoureId, id);
  if(!isPermission) throw new Error();  
  await next();
 } catch (err) {
  const error = new Error(errorTypes.UNPERMISSION);
  return ctx.app.emit("error",error,ctx);
 }
};
module.exports = {
  verifyLogin,
  verifyAuth,
  verifyPermission
}