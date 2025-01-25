import crypto from 'crypto';

export const generateRandomString = (length = 8) => {
  return crypto.randomBytes(length).toString('hex');
};

export const generateContainerName = (prefix) => {
  return `${prefix}-${generateRandomString(6)}`;
};

export const generateCredentials = () => {
  return {
    username: `user_${generateRandomString(6)}`,
    password: generateRandomString(12),
    database: `db_${generateRandomString(6)}`
  };
}; 