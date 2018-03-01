import request from './fetch'

async function doFetch(data) {
    const result = await request({
        url: 'http://localhost:3000/index',
        method: 'post',
        errorTips: true,
        body: data
    });
    console.log('result:', result);
    if(result && result.success){
        alert('ok!')
    }
};

document.getElementsByTagName('input')[0].onchange = function(){
    const data= new FormData();
    data.append('name', 'FormData');
    data.append('file', this.files[0]);
    doFetch(data);
}
