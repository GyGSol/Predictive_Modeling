/**
 * PRODE-9: Validación de entradas con Zod (OWASP A03 — Injection)
 * T-Shirt: S
 */
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten(),
      });
    }
    req[source] = result.data;
    next();
  };
}
