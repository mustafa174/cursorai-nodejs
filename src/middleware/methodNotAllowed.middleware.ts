import { Request, Response, NextFunction, Application } from 'express';
import { sendError } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';

/**
 * Extract all registered routes and their allowed methods from Express app
 */
function extractRoutes(app: Application): Map<string, Set<string>> {
  const routes = new Map<string, Set<string>>();

  // Helper function to extract base path from router regex
  function extractRouterPath(regexSource: string): string {
    // Express router regex pattern: /^\/?(?=\/|$)/i or /^\/api(?=\/|$)/i
    const regex = /\^\\?\/?([^\\?(\n]*)/;
    const match = regex.exec(regexSource);
    return match?.[1] ? '/' + match[1].replace(/\\\//g, '/').replace(/\\/g, '') : '';
  }

  // Helper function to process route layer
  function processLayer(layer: any, basePath = ''): void {
    if (layer.route) {
      // This is a route layer
      const fullPath = basePath + layer.route.path;
      const methods = Object.keys(layer.route.methods)
        .filter((method) => layer.route.methods[method])
        .map((method) => method.toUpperCase());

      if (!routes.has(fullPath)) {
        routes.set(fullPath, new Set<string>());
      }

      const routeSet = routes.get(fullPath);
      methods.forEach((method) => {
        routeSet?.add(method);
      });
    } else if (layer.name === 'router' && layer.handle?.stack) {
      // This is a router middleware
      const routerPath = extractRouterPath(layer.regexp.source);
      const newBasePath = basePath + routerPath;

      layer.handle.stack.forEach((nestedLayer: any) => {
        processLayer(nestedLayer, newBasePath);
      });
    }
  }

  // Process all middleware and route layers
  app._router?.stack?.forEach((layer: any) => {
    processLayer(layer);
  });

  return routes;
}

/**
 * Normalize route path for comparison
 * Converts route parameters to a regex pattern
 */
function normalizeRoutePath(path: string): RegExp {
  // Convert Express route parameters to regex
  // /api/users/:id -> /api/users/[^/]+
  const regexPattern = path
    .replace(/:[^/]+/g, '[^/]+') // Replace :param with regex
    .replace(/\//g, '\\/'); // Escape slashes

  return new RegExp(`^${regexPattern}$`);
}

/**
 * Find matching route and its allowed methods
 */
function findMatchingRoute(
  requestPath: string,
  routes: Map<string, Set<string>>
): { path: string; methods: Set<string> } | null {
  for (const [routePath, methods] of routes.entries()) {
    const routeRegex = normalizeRoutePath(routePath);
    if (routeRegex.test(requestPath)) {
      return { path: routePath, methods };
    }
  }
  return null;
}

/**
 * Method Not Allowed Middleware
 *
 * This middleware detects when a route exists but the HTTP method is not allowed.
 * It should be placed AFTER all routes and BEFORE the 404 handler.
 *
 * @param app - Express application instance
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * import { methodNotAllowedMiddleware } from './middleware/methodNotAllowed.middleware';
 *
 * // Register routes first
 * app.use('/api', routes);
 *
 * // Then add method not allowed handler
 * app.use(methodNotAllowedMiddleware(app));
 *
 * // Finally add 404 handler
 * app.use(notFoundHandler);
 * ```
 */
export function methodNotAllowedMiddleware(app: Application) {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    // Extract all routes from the app
    const routes = extractRoutes(app);

    // Find if there's a matching route for this path
    const matchingRoute = findMatchingRoute(req.path, routes);

    if (matchingRoute) {
      const allowedMethods = Array.from(matchingRoute.methods);
      const requestMethod = req.method.toUpperCase();

      // Check if the request method is in the allowed methods
      if (!allowedMethods.includes(requestMethod)) {
        // Set the Allow header
        res.setHeader('Allow', allowedMethods.join(', '));

        // Return 405 Method Not Allowed
        return sendError(
          res,
          HTTP_STATUS.METHOD_NOT_ALLOWED,
          `Method ${requestMethod} not allowed for this endpoint. Use one of: ${allowedMethods.join(', ')}`,
          {
            error: 'MethodNotAllowed',
            allowed: allowedMethods,
          }
        );
      }
    }

    // If no matching route or method is allowed, continue to next middleware (404 handler)
    (next as any)();
  };
}

/**
 * Alternative implementation: Method Not Allowed Handler for specific routes
 *
 * This can be used on individual routes to explicitly handle method not allowed errors.
 *
 * @param allowedMethods - Array of allowed HTTP methods
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * import { methodNotAllowedHandler } from './middleware/methodNotAllowed.middleware';
 *
 * // Apply to a specific route
 * router.all('/users/:id', methodNotAllowedHandler(['GET', 'PUT', 'DELETE']));
 * ```
 */
export function methodNotAllowedHandler(allowedMethods: string[]) {
  return (req: Request, res: Response, next: NextFunction): void | Response => {
    const requestMethod = req.method.toUpperCase();
    const allowed = allowedMethods.map((method) => method.toUpperCase());

    if (!allowed.includes(requestMethod)) {
      res.setHeader('Allow', allowed.join(', '));

      return sendError(
        res,
        405,
        `Method ${requestMethod} not allowed for this endpoint. Use one of: ${allowed.join(', ')}`,
        {
          error: 'MethodNotAllowed',
          allowed,
        }
      );
    }

    (next as any)();
  };
}

export default methodNotAllowedMiddleware;
