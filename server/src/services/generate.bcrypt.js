import bcrypt from 'bcrypt';
async function hashPassword(password) {
  const saltRounds = 10;
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
}
export default hashPassword;
