import * as Koa from 'koa'
import * as serve from 'koa-static'

const app = new Koa()

app.use(serve('dist/'));

app.listen(process.env.PORT || 5000)
