const Router = require("koa-router");
const { verifyAuth, verifyPermission } = require("../middleware/auth.middleware");
const commmentRouter = new Router({prefix: "/comment"});

const {create,reply,update,remove, list} = require("../controller/comment.controller");

commmentRouter.post("/",verifyAuth,create);
commmentRouter.post("/:commentId/reply",verifyAuth,reply);
//修改评论
commmentRouter.patch("/:commentId",verifyAuth,verifyPermission,update)
//删除评论
commmentRouter.delete("/:commentId",verifyAuth,verifyPermission,remove);

//获取评论列表
commmentRouter.get("/",list);
module.exports = commmentRouter;  