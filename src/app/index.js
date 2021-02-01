const koa = require("koa");
const bodyParser = require("koa-bodyparser");
const app = new koa();

const errorHandle = require("./error-handle");
const useRoutes = require("../router");

app.useRoutes = useRoutes;
app.use(bodyParser());
app.useRoutes();
app.on("error",errorHandle);

module.exports = app;