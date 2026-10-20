const withHeaders = (response) => {
  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "no-store");
  headers.set("X-Robots-Tag", "noindex, nofollow");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
};

const safeEqual = (a, b) => {
  const enc = new TextEncoder();
  const x = enc.encode(a);
  const y = enc.encode(b);
  let diff = x.length ^ y.length;
  for (let i = 0; i < Math.max(x.length, y.length); i += 1) {
    diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
  }
  return diff === 0;
};

export default async (request, context) => {
  const password = Netlify.env.get("SITE_PASSWORD");
  if (!password) {
    return withHeaders(new Response("Site under review", { status: 503 }));
  }

  const header = request.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    try {
      const decoded = new TextDecoder().decode(Uint8Array.from(atob(header.slice(6)), (c) => c.charCodeAt(0)));
      const given = decoded.slice(decoded.indexOf(":") + 1);
      if (safeEqual(given, password)) {
        return withHeaders(await context.next());
      }
    } catch {
      // malformed header: fall through to 401
    }
  }

  return withHeaders(
    new Response("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="ContaPesca review", charset="UTF-8"' },
    }),
  );
};

export const config = { path: "/*" };
