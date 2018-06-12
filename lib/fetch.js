import 'isomorphic-fetch';

import defaultConfig from './defaultConfig';

const _config = Symbol('config');
const _currentService = Symbol('currentService');

export default class Request {
  constructor(config, logger) {
    this[_config] = config || defaultConfig;
    if (logger) {
      this.logger = logger.info;
    } else {
      this.logger = console.log;
    }
  }

  prepareRequestBody(options) {
    options.header = options.header || {}
    options.header['Content-Type'] = options.header['Content-Type'] || 'application/json';

    if (options.header && options.header['Content-Type'] && options.header['Content-Type'].indexOf('x-www-form-urlencoded') >= 0) {
      let params = new URLSearchParams();
      for (const key in options.body) {
        params.append(key, data[key]);
      };
      options.body = params;
    }

    const obj = {};

    if (options.method.toLowerCase() !== 'get') {
      obj.body = JSON.stringify(options.body);
    }

    obj.method = options.method;
    obj.headers = options.header;

    //add cookie config 
    obj.credentials = options.credentials || 'include';

    return obj;
  }

  /**
   * ------------------------------------------------------------------
   * ?options: object
   * ------------------------------------------------------------------
   * service:string = 'default'
   * method: string = 'POST'
   * body: object
   * header: object = { 'Content-Type': 'application/json'}
   * 
   */
  request(path, options) {
    //save this reference
    const _this = this;
    //client fetch doesn't need domain 
    const tempService = typeof window === 'undefined' ?  (options.service || _this[_currentService] || _this.config.default) : '';
    const opt = this.prepareRequestBody(options);

    _this.logger(`FunseeRequest - Request path: ${tempService}${path} | Request body: ${JSON.stringify(opt)}`);

    return new Promise((resolve, reject) => {
      fetch(`${tempService}${path}`, opt)
      .then((response) => {
        // reset _currentService
        _this[_currentService] = null;
        const contentType = response.headers.get('Content-Type');
        if(contentType.indexOf('json') < 0) {
          return response.text();
        }
        return response.json();
      }).then((data) => {
        _this.logger(`FunseeRequest - Response data: ${data}`);
        resolve(data);
      }).catch((ex) => {
        _this.logger(`FunseeRequest - Request error: ${ex}`);
        reject(ex);
      });
    });
  }

  use(serviceName) {
    this[_currentService] = this.config[serviceName];

    return this;
  }

  get(path, options) {
    const opts = {
      ...options,
      method: 'GET'
    };

    return this.request(path, opts);
  }

  post(path, body, options) {
    const opts = {
      ...options,
      body,
      method: 'POST',
    };

    return this.request(path, opts);
  }

  get config() {
    return this[_config];
  }

  get currentService() {
    return typeof window === 'undefined' ? this[_currentService] : '';
  }
  
};
