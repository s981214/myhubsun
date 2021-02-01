const Router = require("koa-router");
const { saveAvatarInfo, savePictureInfo } = require("../controller/file.controller");

const { verifyAuth } = require("../middleware/auth.middleware");
const { avatarHandle, pictureHandle, pictureResize } = require("../middleware/file.middleware");


const fileRouter = new Router({prefix: "/upload"});

fileRouter.post("/avatar",verifyAuth,avatarHandle, saveAvatarInfo);
fileRouter.post("/picture",verifyAuth,pictureHandle, pictureResize,savePictureInfo)

module.exports = fileRouter;