import { join } from "path";
import { createRequestHandler } from "@expo/server/adapter/vercel";
// import { SANITY_STUDIO_URL } from "@/constants";

// Pre-compile the Expo server bundle once per cold start
export default createRequestHandler({
    build: join(process.cwd(), 'dist/server'),
});

// // Vercel entry point
// export default function handler(req: any, res: any) {
//   // 🔑 Set or overwrite CSP *before* the Expo handler runs
//   res.setHeader(
//     "Content-Security-Policy",
//     `frame-ancestors 'self' ${SANITY_STUDIO_URL}`
//   );

//   // Delegate to Expo Router’s dispatcher (routes to /app/api/** code)
//   return handle(req, res);
// }