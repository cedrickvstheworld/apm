import bcrypt from "bcrypt";

export const hash = async (plain: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(plain, salt)
  return hashed
}

export const test = async (plain: string, hashed: string)
  : Promise<boolean> => {
  return await bcrypt.compare(plain, hashed)
}

