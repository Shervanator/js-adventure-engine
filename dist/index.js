"use strict";
exports.__esModule = true;
var Koa = require("koa");
var serve = require("koa-static");
var app = new Koa();
app.use(serve('dist/'));
app.listen(process.env.PORT || 5000);
