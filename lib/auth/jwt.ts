import { jwtVerify, SignJWT } from "jose";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
}

const DEFAULT_SECRET = "guardian-lab-default-session-secret-key-32-bytes";
const SESSION_EXPIRATION = "7d";

function getEncodedSecret(): Uint8Array {
  const secret = process.env.SESSION_SECRET || process.env.AUTH_SECRET || DEFAULT_SECRET;
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(payload: SessionPayload): Promise<string> {
  const encodedKey = getEncodedSecret();

  return new SignJWT({
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(crypto.randomUUID())
    .setIssuedAt()
    .setExpirationTime(SESSION_EXPIRATION)
    .sign(encodedKey);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  if (!token || typeof token !== "string") {
    return null;
  }

  try {
    const encodedKey = getEncodedSecret();
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ["HS256"],
    });

    const userId = payload.userId;
    const email = payload.email;
    const name = payload.name;
    const role = payload.role;

    if (
      typeof userId !== "string" ||
      typeof email !== "string" ||
      typeof name !== "string" ||
      (role !== "USER" && role !== "ADMIN")
    ) {
      return null;
    }

    return {
      userId,
      email,
      name,
      role,
    };
  } catch {
    return null;
  }
}
