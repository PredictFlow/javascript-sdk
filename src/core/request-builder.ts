/**
 * Request helper utilities for building clean URLs and query strings.
 */

export type QueryValue = string | number | boolean | undefined | null | (string | number | boolean)[];
export type QueryParams = Record<string, QueryValue>;

/**
 * Builds a full target URL by combining baseUrl, path, and optional query parameters.
 */
export function buildUrl(baseUrl: string, path: string, queryParams?: QueryParams): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${baseUrl}${cleanPath}`);

  if (queryParams) {
    for (const [key, value] of Object.entries(queryParams)) {
      if (value === undefined || value === null) {
        continue;
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          if (item !== undefined && item !== null) {
            url.searchParams.append(key, String(item));
          }
        }
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}
