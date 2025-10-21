import swaggerJsdoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Node.js TypeScript REST API',
    version: '1.0.0',
    description:
      'Production-ready REST API with authentication, built with TypeScript, Express, and MongoDB',
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
    {
      url: 'https://api.yourapp.com',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token in the format: Bearer <token>',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          _id: {
            type: 'string',
            example: '507f1f77bcf86cd799439011',
          },
          name: {
            type: 'string',
            example: 'John Doe',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john@example.com',
          },
          phone: {
            type: 'string',
            example: '+1-234-567-8900',
            description: 'Optional. 6-20 characters',
          },
          address: {
            type: 'string',
            example: '123 Main Street, Apt 4B',
            description: 'Optional. Max 200 characters',
          },
          country: {
            type: 'string',
            example: 'United States',
            description: 'Optional. Max 100 characters',
          },
          displayPicture: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL to access the display picture',
                example: 'http://localhost:5000/api/auth/display-picture/507f1f77bcf86cd799439011',
              },
              contentType: {
                type: 'string',
                example: 'image/jpeg',
              },
            },
            description: 'Optional. Uploaded image stored as Buffer',
          },
          isEmailVerified: {
            type: 'boolean',
            example: false,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          code: {
            type: 'number',
            example: 200,
          },
          message: {
            type: 'string',
            example: 'Operation successful',
          },
          data: {
            type: 'object',
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          code: {
            type: 'number',
            example: 400,
          },
          message: {
            type: 'string',
            example: 'Error message',
          },
          error: {
            type: 'object',
          },
        },
      },
    },
  },
  tags: [
    {
      name: 'Authentication',
      description: 'User authentication endpoints',
    },
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
  ],
};

const options = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'], // Path to API docs
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
