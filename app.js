const Koa = require('koa');
const views = require('koa-views');
const server = require('koa-static');

const app = new Koa();

app.use(views('views', { extension: 'ejs' }));

app.use(server('public'));

app.use(async ctx => {
  await ctx.render('index', {});
});


const port = process.env.PORT || '3033';
app.listen(port);
console.log(`Listen on port: ${port}`);
