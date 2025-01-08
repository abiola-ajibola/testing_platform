import bcrypt from "bcrypt";
const SALT_ROUNDS = 10;
export async function hashPassword(password: string): Promise<string> {
  try {
    return await bcrypt.hash(password, SALT_ROUNDS);
  } catch (e) {
    console.error(e);
    return "";
  }
}

export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (e) {
    console.error(e);
    return false;
  }
}
