import { compare } from 'bcrypt';

export const comparePassword = async (
  input: string,
  stored: string,
): Promise<boolean> => {
  try {
    return await compare(input, stored);
  } catch (error) {
    console.error('Error in comparePassword function:', error);
    return false;
  }
};
