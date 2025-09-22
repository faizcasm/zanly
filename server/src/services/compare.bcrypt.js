import bcrypt from 'bcrypt';
async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}
export default verifyPassword;
