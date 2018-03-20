npm install fun-see-request;

important request from 'fun-see-request';


示例：
  const options = {
    url: 'http://localhost:3000/index',
    method: 'post',
    body: data
  }
  
  const result = await request(options);
  result就是请求结果



request测试options：
  options 除 fetch 的 options所有参数外 还有
   * url 请求链接
   * loading 请求过程加loading动画                          // 需要先配置
   * errorTips 自动处理错误(一般以toast方式)                  // 需要先配置
   * translateResponseBySelf 发送http请求后，response自己处理
   * needLogin 是否需要登录                                 // 需要先配置


request属性config:
  用来配置一个http请求不同的节点的回调

  添加一个配置：
    request.config.add(options);
      options = {
        id: 'defaults', // 配置id
        showLoading: () => console.log('showLoading'), // request start 钩子函数配置
        hideLoading: () => console.log('hideLoading'), // request end 钩子函数配置
        errorHandler(data, options) {}, // data:response或error; options:request参数
        toast: () => console.log('toast') // 错误提示配置
      }
      
  更换一个配置：    
    request.config.change(id); // 配置Id
      
