/** Parse `key=value; key2=value2` or comma-separated context strings into fields. */
export function parseContextFields(context: string): Record<string, string> {
  const fields: Record<string, string> = {};
  const segments = context.split(/[;;\n]+/);
  for (const segment of segments) {
    const trimmed = segment.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf("=");
    if (eq > 0) {
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (key) fields[key] = value;
    } else if (trimmed.includes(":")) {
      const colon = trimmed.indexOf(":");
      const key = trimmed.slice(0, colon).trim();
      const value = trimmed.slice(colon + 1).trim();
      if (key) fields[key] = value;
    }
  }
  return fields;
}

export function mergeContextFields(
  ...sources: Record<string, string>[]
): Record<string, string> {
  return Object.assign({}, ...sources);
}
