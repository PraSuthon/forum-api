const ThreadsHandler = require('./handler');
const routes = require('./routes');

const plugin = {
  name: 'threads',
  register: async (server, { container }) => {
    const threadsHandler = new ThreadsHandler(container);
    server.route(routes(threadsHandler));
  },
};

module.exports = plugin;
