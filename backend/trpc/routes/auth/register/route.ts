import { z } from 'zod';
import { publicProcedure } from '../../../create-context';
import { userOperations } from '../../../../db/operations';

export const registerProcedure = publicProcedure
  .input(z.object({
    email: z.string().email(),
    password: z.string().min(6),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().min(1),
    role: z.enum(['guest', 'student', 'landlord', 'admin']).default('guest'),
    companyName: z.string().optional(),
    address: z.string().optional(),
  }))
  .mutation(async ({ input }) => {
    try {
      const existingUser = await userOperations.findByEmail(input.email);
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user = await userOperations.create(input);
      
      // Don't return password hash
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error instanceof Error ? error.message : 'Registration failed');
    }
  });