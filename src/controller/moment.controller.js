const fs = require("fs");

const fileService = require("../service/file.service");
const momentService = require("../service/moment.service");
const { PICTURE_PATH } = require("../constants/file-path");
class MomentController {
  async create(ctx,next) {
    //1.获取数据user_id content
    const userId = ctx.user.id;
    const content = ctx.request.body.content;
    const result = await momentService.create(userId, content);
    ctx.body = result;
  }
  async detail(ctx,next) {
    const momentId = ctx.params.momentId;
    const result = await momentService.getMomentById(momentId);

    ctx.body =  result;
  }
  async list(ctx, next) {
     //1.获取数据offset 和size
     const {offset,size} = ctx.query;
    //  2.查询列表
    const result = await momentService.getMomentList(offset,size);
    ctx.body = result; 

  }  
  async update(ctx, next) {
    const {momentId} = ctx.request.params; 
    const {content} = ctx.request.body;
    //修改内容
    const result = await momentService.update(content,momentId);
    ctx.body = result;
  }
  async remove(ctx, next) {
    const {momentId} = ctx.request.params;

    const result = await momentService.remove(momentId);
    ctx.body = result;
  }
  async addLabels(ctx, next) {
    //1.获取标签和动态id
    const {labels} = ctx;
    const {momentId} = ctx.params;
    //2.添加所有标签
    for(let label of labels) {
      //判断动态中是否有标签
      const isExist = await momentService.hasLabel(momentId, label.id);
      if(!isExist) {
        await momentService.addLabel(momentId,label.id);
      } 
    }

    ctx.body = "给动态添加标签成功";
  }
  async fileInfo(ctx, next) {
    let { filename } = ctx.params;
    const fileInfo = await fileService.getFileByFilename(filename);
    const { type } = ctx.query;
    const types = ['small','middle','large'];
    if(types.some(item => item == type)) {
      filename = filename + '-' + type;
    }
    
    ctx.response.set("content-type",fileInfo.mimetype);
    ctx.body = fs.createReadStream(`${PICTURE_PATH}/${filename}-small`);
  }
}

module.exports = new MomentController();