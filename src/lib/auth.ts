import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'admin' | 'customer';
}

export interface AuthToken {
  userId: string | number;
  email: string;
  role: 'admin' | 'customer';
}

export function verifyToken(token: string): AuthToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthToken;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function createToken(user: User): string {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function requireAuth(token: string | null): AuthToken {
  if (!token) {
    throw new Error('Authentication required');
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    throw new Error('Invalid or expired token');
  }

  return decoded;
}

export function requireAdmin(token: string | null): AuthToken {
  const user = requireAuth(token);
  
  if (user.role !== 'admin') {
    throw new Error('Admin access required');
  }

  return user;
}