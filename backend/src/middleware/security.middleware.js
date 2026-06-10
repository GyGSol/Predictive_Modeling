/**
 * PRODE-9: Sanitización de entradas contra XSS (OWASP A03)
 * T-Shirt: S
 */
import sanitizeHtml from 'sanitize-html';

const SANITIZE_OPTIONS = {
  allowedTags: [],
  allowedAttributes: {},
};

function sanitizeValue(value) {
  if (typeof value === 'string') {
    return sanitizeHtml(value, SANITIZE_OPTIONS).trim();
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nested]) => [key, sanitizeValue(nested)])
    );
  }
  return value;
}

export function sanitizeInputs(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }
  next();
}
