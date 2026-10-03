import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password) {
    return '';
  }
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verifies a plaintext password against a stored hash or legacy plaintext password.
 * Handles both standard bcrypt hashes and fallback plaintext comparisons for initial seed/demo users.
 */
export async function verifyPassword(password: string, storedHashOrPlain?: string): Promise<boolean> {
  if (!password || !storedHashOrPlain) {
    return false;
  }

  // Check if stored string looks like a bcrypt hash ($2a$, $2b$, $2y$, $2x$)
  const isBcryptHash = /^\$2[abyx]?\$\d+\$/.test(storedHashOrPlain);

  if (isBcryptHash) {
    try {
      const match = await bcrypt.compare(password, storedHashOrPlain);
      return match;
    } catch {
      return false;
    }
  }

  // Fallback for demo seed accounts (e.g. 'password123')
  return password === storedHashOrPlain;
}
