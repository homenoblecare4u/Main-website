import { UserRepository } from '@/server/repositories/user.repository';
import { SignupInput } from '@/server/validators/user.validator';
import { logger } from '@/server/utils/logger';

export interface ServiceSignupResult {
  status: 'new' | 'existing' | 'spam_ignored';
  leadId?: string;
  message: string;
}

export class UserService {
  constructor(private repository: UserRepository) {}

  async registerUser(data: SignupInput): Promise<ServiceSignupResult> {
    // Honeypot spam check: silent discard
    if (data.website && data.website.trim() !== '') {
      logger.info('Honeypot triggered, silently discarding spam enquiry');
      return {
        status: 'spam_ignored',
        message: 'Your inquiry has been successfully received.',
      };
    }

    const campaignData = {
      route: data.route || '/',
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
      utm_content: data.utm_content,
      utm_term: data.utm_term,
      platform: data.platform,
      gclid: data.gclid,
      fbclid: data.fbclid,
      fbp: data.fbp,
      fbc: data.fbc,
      matchtype: data.matchtype,
      network: data.network,
      device: data.device,
      keyword: data.keyword,
      placement: data.placement,
      campaignid: data.campaignid,
      adgroupid: data.adgroupid,
    };

    const careData = {
      careNeeded: data.careNeeded,
      additionalInfo: data.additionalInfo,
    };

    const userData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      countryCode: data.countryCode || '+91',
      timezone: data.timezone || 'Asia/Kolkata',
    };

    // Deduplication by phone number
    const existingUser = await this.repository.findByPhone(data.phone);

    if (existingUser) {
      logger.info('Existing user inquiry received; updating demographics and appending touchpoints');
      await this.repository.updateExistingUser(
        existingUser._id as any,
        userData,
        campaignData,
        careData
      );

      return {
        status: 'existing',
        leadId: String(existingUser._id),
        message: 'Your inquiry has been updated. Our care coordinator will contact you shortly.',
      };
    }

    logger.info('New user inquiry received; creating user and touchpoints');
    const newUser = await this.repository.createUser(userData, campaignData, careData);

    return {
      status: 'new',
      leadId: String(newUser._id),
      message: 'Thank you! Your care inquiry has been registered. Our care coordinator will contact you shortly.',
    };
  }
}
