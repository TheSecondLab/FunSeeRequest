import 'isomorphic-fetch';

import defaultConfig from './defaultConfig';

const _config = Symbol('config');
const _currentService = Symbol('currentService');

export default class Request {
  constructor(config) {
    this[_config] = config || defaultConfig;
  }

  prepareRequestBody(options) {
    if(options.header) {
      options.header['Content-Type'] = options.header['Content-Type'] || 'application/json;utf-8';
    }

    if (options.header && options.header['Content-Type'] && options.header['Content-Type'].indexOf('x-www-form-urlencoded') >= 0) {
      let params = new URLSearchParams();
      for (const key in options.body) {
        params.append(key, data[key]);
      };
      options.body = params;
    }

    const obj = {};

    if (options.method.toLowerCase() !== 'get') {
      obj.body = options.body;
    }

    obj.method = options.method;
    obj.header = options.header;

    return obj;
  }

  /**
   * ------------------------------------------------------------------
   * ?options: object
   * ------------------------------------------------------------------
   * service:string = 'default'
   * method: string = 'POST'
   * body: object
   * header: object = { 'Content-Type': 'application/json;utf-8'}
   * 
   */
  request(path, options) {
    const tempService = options.service || this.currentService || this.config.default;
    const opt = this.prepareRequestBody(options);

    return new Promise((resolve, reject) => {
      fetch(`${tempService}${path}`, opt)
      .then((response) => {
        const contentType = response.headers.get('Content-Type');
        if(contentType.indexOf('json') < 0) {
          return response.text();
        }
        return response.json();
      }).then((data) => {
        resolve(data);
      }).catch((ex) => {
        reject(ex);
      });
    });
  }

  use(serviceName) {
    this[_currentService] = this.config[serviceName];

    return this;
  }

  get(path) {
    const options = {
      method: 'GET'
    };

    return this.request(path, options);
  }

  post(path, body) {
    const options = {
      method: 'POST',
      body
    };

    return this.request(path, options);
  }

  get config() {
    return this[_config];
  }

  get currentService() {
    return typeof window === 'undefined' ? this[_currentService] : '';
  }
  
};
