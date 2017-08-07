
const path = require('path');

const root = path.resolve(__dirname, '..');
const app  = path.join(root, 'app');

const paths = {
  to: {
    root,
    app,
    public:  '/',

    build:   path.join(root, 'build'),
    modules: path.join(root, 'node_modules'),

    sources: path.join(app, 'sources'),
    styles:  path.join(app, 'styles'),
    assets:  path.join(app, 'assets'),
  }
};

module.exports = paths;
