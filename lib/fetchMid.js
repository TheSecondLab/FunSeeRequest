import Request from './fetch';

export default fetchMid = (app, config) => {
  app.context.request = new Request(config);
};
