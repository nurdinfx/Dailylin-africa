import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies, headers } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'dailylink-africa-super-secure-jwt-key-editorial-2026';

export interface AdminPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export function signAdminToken(payload: AdminPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyAdminToken(token: string): AdminPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AdminPayload;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminPayload | null> {
  try {
    let token: string | undefined;

    // 1. Check HTTP-only cookie (set at login)
    try {
      const cookieStore = await cookies();
      token = cookieStore.get('dailylink_admin_token')?.value;
    } catch {
      // Next.js 14 – cookies() may be synchronous in some runtimes
      try {
        // @ts-ignore
        const cookieStore = cookies();
        token = cookieStore.get('dailylink_admin_token')?.value;
      } catch {
        // ignore
      }
    }

    // 2. Fallback: Authorization header (Bearer token)
    if (!token) {
      try {
        const headerStore = await headers();
        const authHeader = headerStore.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      } catch {
        try {
          // @ts-ignore
          const headerStore = headers();
          const authHeader = headerStore.get('authorization');
          if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
          }
        } catch {
          // ignore
        }
      }
    }

    if (!token) return null;

    const decoded = verifyAdminToken(token);
    if (!decoded) return null;

    // Verify the user still exists in the database
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!user) return null;

    return {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch {
    return null;
  }
}
