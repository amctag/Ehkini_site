/** @returns {{ url: string, method: string, body: unknown }} */
export function parseRequestArgs(args) {
  if (typeof args === "string") {
    return { url: args, method: "GET", body: undefined };
  }

  return {
    url: args.url,
    method: (args.method ?? "GET").toUpperCase(),
    body: args.body
  };
}

/** Strip query string for route matching */
export function pathOnly(url) {
  return url.split("?")[0];
}
