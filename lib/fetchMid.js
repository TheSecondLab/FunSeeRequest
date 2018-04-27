import Request from './fetch';

export default (app, config) => {
  app.context.request = new Request(config);
};
