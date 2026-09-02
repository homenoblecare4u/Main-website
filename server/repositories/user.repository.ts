import User, { IUser } from '@/server/models/User';
import UtmCampaign from '@/server/models/UtmCampaign';
import CareInfo from '@/server/models/CareInfo';

import mongoose from 'mongoose';

export class UserRepository {
  async findByEmailOrPhone(email: string | undefined, phone: string): Promise<IUser | null> {
    const conditions: any[] = [{ phone }];
    if (email) conditions.push({ email });
    return User.findOne({ $or: conditions });
  }

  async createUser(userData: Partial<IUser>, campaignData: any, careData: any): Promise<IUser> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Check again inside transaction to prevent race conditions
      const conditions: any[] = [{ phone: userData.phone }];
      if (userData.email) conditions.push({ email: userData.email });

      const existingUser = await User.findOne({ 
        $or: conditions 
      }).session(session);

      if (existingUser) {
        throw new Error('USER_ALREADY_EXISTS');
      }

      const [user] = await User.create([userData], { session });
      
      const tasks = [];
      if (Object.keys(campaignData).length > 0) {
        tasks.push(UtmCampaign.create([{ userId: user._id, ...campaignData }], { session }));
      }
      if (Object.keys(careData).length > 0) {
        tasks.push(CareInfo.create([{ userId: user._id, ...careData }], { session }));
      }
      await Promise.all(tasks);

      await session.commitTransaction();
      return user;
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateExistingUser(userId: mongoose.Types.ObjectId, userData: Partial<IUser>, campaignData: any, careData: any) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      if (userData) {
        await User.findByIdAndUpdate(userId, {
          $set: {
            name: userData.name,
            city: userData.city,
            countryCode: userData.countryCode,
            timezone: userData.timezone,
          }
        }, { session });
      }

      const tasks = [];
      if (Object.keys(campaignData).length > 0) {
        tasks.push(UtmCampaign.create([{ userId, ...campaignData }], { session }));
      }
      if (Object.keys(careData).length > 0) {
        tasks.push(CareInfo.create([{ userId, ...careData }], { session }));
      }
      await Promise.all(tasks);
      
      await session.commitTransaction();
      return true;
    } catch (error) {
      if (session.inTransaction()) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      session.endSession();
    }
  }
}
