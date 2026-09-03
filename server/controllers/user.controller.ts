import { UserService } from '@/server/services/user.service';
import { sendSuccess, sendError } from '@/server/utils/response';
import { SignupSchema } from '@/server/validators/user.validator';
import { HTTP_STATUS, ERROR_CODES } from '@/server/config/constants';
import { NextRequest } from 'next/server';
import { logger } from '@/server/utils/logger';

export class UserController {
  constructor(private service: UserService) {}

  async signup(req: NextRequest) {
    try {
      let body: unknown;
      try {
        body = await req.json();
      } catch {
        return sendError(
          'We received an invalid request format. Please try submitting again.',
          ERROR_CODES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST
        );
      }

      const validationResult = SignupSchema.safeParse(body);

      if (!validationResult.success) {
        logger.warn('Signup validation failed for incoming payload');
        return sendError(
          'Please check your details and try again. Some information seems to be missing or incorrect.',
          ERROR_CODES.VALIDATION_ERROR,
          HTTP_STATUS.BAD_REQUEST,
          validationResult.error.flatten().fieldErrors
        );
      }

      const clientIp =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        undefined;
      const userAgent = req.headers.get('user-agent') || undefined;

      const result = await this.service.registerUser(
        validationResult.data,
        clientIp,
        userAgent
      );

      const status = result.status === 'new' ? HTTP_STATUS.CREATED : HTTP_STATUS.OK;
      return sendSuccess(
        { leadId: result.leadId },
        result.message,
        status
      );
    } catch (error: unknown) {
      logger.error(
        { errorName: error instanceof Error ? error.name : 'UnknownError' },
        'Error during signup processing'
      );
      return sendError(
        'An unexpected error occurred while processing your enquiry. Please try again shortly.',
        ERROR_CODES.UNKNOWN_ERROR,
        HTTP_STATUS.INTERNAL_SERVER_ERROR
      );
    }
  }
}
