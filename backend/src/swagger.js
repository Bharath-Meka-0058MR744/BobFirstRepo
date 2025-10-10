/**
 * Swagger Integration
 * This file sets up Swagger documentation for the API
 */

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerConfig = require('./config/swagger');
const apiDocs = require('./apiDocs');

/**
 * Generate Swagger specification from JSDoc comments and configuration
 */
const swaggerSpec = swaggerJsdoc(swaggerConfig);

/**
 * Enhance Swagger specification with existing API documentation
 */
function enhanceSwaggerSpec() {
  // Add paths from apiDocs
  Object.keys(apiDocs.modules).forEach(moduleName => {
    const module = apiDocs.modules[moduleName];
    
    module.endpoints.forEach(endpoint => {
      const path = endpoint.path.replace(/:[a-zA-Z0-9]+/g, match => `{${match.substring(1)}}`);
      const fullPath = module.basePath + (path === '/' ? '' : path);
      
      if (!swaggerSpec.paths[fullPath]) {
        swaggerSpec.paths[fullPath] = {};
      }
      
      const method = endpoint.method.toLowerCase();
      
      // Create path operation object
      swaggerSpec.paths[fullPath][method] = {
        tags: [moduleName.charAt(0).toUpperCase() + moduleName.slice(1)],
        summary: endpoint.description,
        description: endpoint.description,
        responses: {
          '200': {
            description: endpoint.response,
            content: {
              'application/json': {
                schema: {
                  $ref: `#/components/schemas/${getSchemaForModule(moduleName, method)}`
                }
              }
            }
          },
          '400': {
            $ref: '#/components/responses/BadRequest'
          },
          '404': {
            $ref: '#/components/responses/NotFound'
          },
          '500': {
            $ref: '#/components/responses/InternalError'
          }
        }
      };
      
      // Add parameters for path variables
      const pathParams = (endpoint.path.match(/:[a-zA-Z0-9]+/g) || []).map(param => {
        const paramName = param.substring(1);
        return {
          name: paramName,
          in: 'path',
          required: true,
          schema: {
            type: 'string'
          },
          description: `${paramName} identifier`
        };
      });
      
      if (pathParams.length > 0) {
        swaggerSpec.paths[fullPath][method].parameters = pathParams;
      }
      
      // Add request body for POST and PUT methods
      if (method === 'post' || method === 'put') {
        swaggerSpec.paths[fullPath][method].requestBody = {
          content: {
            'application/json': {
              schema: {
                $ref: `#/components/schemas/${getSchemaForModule(moduleName, method)}`
              }
            }
          },
          required: true
        };
      }
    });
  });
  
  return swaggerSpec;
}

/**
 * Get the appropriate schema reference based on module and method
 */
function getSchemaForModule(moduleName, method) {
  switch (moduleName) {
    case 'users':
      return 'User';
    case 'products':
      return 'Product';
    case 'logistics':
      return 'ProductLogistics';
    case 'payments':
      return 'Payment';
    default:
      return method === 'get' ? 'Product' : 'Product';
  }
}

/**
 * Setup Swagger middleware for Express app
 * @param {express.Application} app - Express application
 */
function setupSwagger(app) {
  const enhancedSpec = enhanceSwaggerSpec();
  
  // Serve Swagger specification as JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(enhancedSpec);
  });
  
  // Setup Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(enhancedSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'BobFirstWebAPP API Documentation',
    customfavIcon: '/favicon.ico'
  }));
  
  console.log('Swagger documentation available at /api-docs');
}

module.exports = {
  setupSwagger
};

// Made with Bob
