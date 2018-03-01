require('babel-core/register');

const request = require('./src/fetch').default;
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa-cors');
const koaBody = require('koa-body');
const bodyParser = require('koa-bodyparser');
const fs = require('fs');
const path = require('path');

const app = new Koa();
const router = new Router();

app.use(cors({
    credentials: true
}));

router.post('/index',async function (ctx, next) {
    console.log('request body ======>', ctx.request.body);
    const result = await new Promise(function(resolve){
        const file = ctx.request.body.files.file;
        const ext = file.name.replace(/.+(?=\.[^.]+$)/, '');
        const storePath =path.resolve(__dirname, './upload/' + Date.now() + ext);
        const stream = fs.createWriteStream(storePath);//创建一个可写流
        fs.createReadStream(file.path).pipe(stream).on('close', () => {
            resolve({
                status: 200,
                body: {success: true},
            });
       }).on('error', (err) => {
            resolve({
                status: 500,
                body: {success: err},
            });
        });//可读流通过管道写入可写流
    });

    ctx.status = result.status;
    ctx.body = result.body;
});

async function doFetch() {
    const result = await request({
        url: 'https://www.baidu.com',
        method: 'post',
        translateResponseBySelf: true,
        body: {a: Date.now()}
    }).then((res)=>{
        return res.text();
    });
    console.log('result ------>', result.slice(0,17));
};

doFetch();

app.use(koaBody({multipart: true})).use(bodyParser()).use(router.routes()).use(router.allowedMethods());

app.listen(3000, ()=>console.log('Koa start at 3000...'));