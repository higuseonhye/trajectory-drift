/** Token overlap fidelity between expected and actual propagated context. */
export function contextFidelity(expected: string, actual: string): number {
  const expectedTokens = tokenize(expected);
  const actualTokens = tokenize(actual);
  if (expectedTokens.size === 0) return 1;
  let overlap = 0;
  for (const token of expectedTokens) {
    if (actualTokens.has(token)) overlap += 1;
  }
  return overlap / expectedTokens.size;
}

export function missingPropagatedFields(
  fields: string[],
  actualContext: string,
): string[] {
  const actual = actualContext.toLowerCase();
  return fields.filter((field) => !actual.includes(field.toLowerCase().replace(/_/g, " ")) && !actual.includes(field.toLowerCase()));
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 2),
  );
}
