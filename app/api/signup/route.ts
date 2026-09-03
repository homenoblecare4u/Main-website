export const dynamic = 'force-dynamic';

import { NextRequest } from 'next/server';
import connectToDatabase from '@/server/config/db';
import { UserController } from '@/server/controllers/user.controller';
import { UserService } from '@/server/services/user.service';
import { UserRepository } from '@/server/repositories/user.repository';
import { sendError } from '@/server/utils/response';
import { HTTP_STATUS, ERROR_CODES } from '@/server/config/constants';
import { logger } from '@/server/utils/logger';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    return await userController.signup(req);
  } catch (error) {
    logger.error(
      { errorName: error instanceof Error ? error.name : 'UnknownError' },
      'Database connection failed in signup route'
    );
    return sendError(
      'We are currently experiencing technical difficulties. Please try again shortly.',
      ERROR_CODES.DATABASE_ERROR,
      HTTP_STATUS.INTERNAL_SERVER_ERROR
    );
  }
}
