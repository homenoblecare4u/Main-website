import User, { IUser } from '@/server/models/User';
import UtmCampaign, { IUtmCampaign } from '@/server/models/UtmCampaign';
import CareInfo, { ICareInfo } from '@/server/models/CareInfo';
import mongoose from 'mongoose';

export class UserRepository {
  /**
   * Finds an existing user strictly by normalized 10-digit Indian phone number.
   */
  async findByPhone(phone: string): Promise<IUser | null> {
    return User.findOne({ phone: phone.trim() });
  }

  /**
   * Creates a new user, their initial care inquiry, and a touchpoint record.
   * Standalone MongoDB safe (no transaction dependency).
   */
  async createUser(
    userData: Partial<IUser>,
    campaignData: Partial<IUtmCampaign>,
    careData: Partial<ICareInfo>
  ): Promise<IUser> {
    // 1. Create User
    const user = await User.create(userData);

    // 2. Always create initial CareInfo record
    await CareInfo.create({
      userId: user._id,
      ...careData,
    });

    // 3. Always create initial UtmCampaign touchpoint (including direct / organic)
    await UtmCampaign.create({
      userId: user._id,
      ...campaignData,
    });

    return user;
  }

  /**
   * Updates demographic information for an existing user and records
   * a brand-new care inquiry and UTM touchpoint.
   * Standalone MongoDB safe (no transaction dependency).
   */
  async updateExistingUser(
    userId: mongoose.Types.ObjectId,
    userData: Partial<IUser>,
    campaignData: Partial<IUtmCampaign>,
    careData: Partial<ICareInfo>
  ): Promise<boolean> {
    // 1. Update demographics on User
    await User.findByIdAndUpdate(userId, {
      $set: {
        name: userData.name,
        city: userData.city,
        countryCode: userData.countryCode || '+91',
        timezone: userData.timezone || 'Asia/Kolkata',
        ...(userData.email ? { email: userData.email } : {}),
      },
    });

    // 2. Always record a new CareInfo entry for this submission
    await CareInfo.create({
      userId,
      ...careData,
    });

    // 3. Always record a new UtmCampaign entry for this submission
    await UtmCampaign.create({
      userId,
      ...campaignData,
    });

    return true;
  }
}
