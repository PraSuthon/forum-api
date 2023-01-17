const RepliesHandler = require('./handler');
const routes = require('./routes');

const plugin = {
  name: 'replies',
  register: async (server, { container }) => {
    const repliesHandler = new RepliesHandler(container);
    server.route(routes(repliesHandler));
  },
};

module.exports = plugin;
