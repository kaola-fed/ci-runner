const Koa = require('koa');
const views = require('koa-views');
const server = require('koa-static');
const moment = require('moment');
const db = require('./utils/db');

const app = new Koa();

app.use(views('views', { extension: 'ejs' }));

app.use(server('public'));

app.use(async ctx => {
  const projects = await db.get();
  await ctx.render('index', Object.assign({ moment }, { projects: projects }));
});


const port = process.env.PORT || '3033';
app.listen(port);
console.log(`Listen on port: ${port}`);
