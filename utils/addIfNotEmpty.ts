export function addIfNotEmpty(key: string, value: unknown) {
  if (value == null) {
    return {};
  }

  if (typeof value === 'object' && !Array.isArray(value)) {
    const filtered = Object.fromEntries(
      Object.entries(value).filter(([, v]) => {
        return v != null && !(typeof v === 'number' && Number.isNaN(v));
      }),
    );

    return Object.keys(filtered).length
      ? { [key]: filtered }
      : {};
  }

  if (typeof value === 'number' && Number.isNaN(value)) {
    return {};
  }

  if (typeof value === 'string' && value === '') {
    return {};
  }

  return { [key]: value };
}