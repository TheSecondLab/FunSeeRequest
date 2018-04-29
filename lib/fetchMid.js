import Request from './fetch';

export default (app, config) => {
  app.context.ajax = new Request(config, app.context.logger);
};
