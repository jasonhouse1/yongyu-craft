// apps/backend/src/shared/auth/jwt.ts
//
// Single source of truth for the member JWT signing/verification secret.
// Fail closed: refuse to start without a real secret rather than silently
// falling back to a value committed in the repo — a built-in fallback would
// let anyone who can read the source forge member sessions.

const secret = process.env.JWT_SECRET?.trim();

if (!secret) {
  throw new Error(
    "JWT_SECRET is not set. Set it in the environment — the server will not " +
      "fall back to a built-in secret (which would let anyone forge member sessions).",
  );
}

// A short secret is weak but still the operator's own value; warn, don't crash
// a working deployment.
if (secret.length < 16) {
  console.warn(
    "[auth] JWT_SECRET is shorter than 16 characters; consider a longer random secret.",
  );
}

export const JWT_SECRET: string = secret;
