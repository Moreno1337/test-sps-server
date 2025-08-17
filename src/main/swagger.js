const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

function mountSwagger(app, { route = '/docs' } = {}) {
  const spec = YAML.load(path.join(__dirname, '../../docs/openapi.yaml'));
  app.get('/openapi.json', (_req, res) => res.json(spec));
  app.use(route, swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));
}

module.exports = { mountSwagger };
