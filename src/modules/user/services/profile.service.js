const AppException = require('@exceptions/app.exception');
const userRepository = require('../repositories/user.repository');

class ProfileService {
  async getProfile(userId) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppException('User not found', 404);
    }

    const { password: _, ...profile } = user;
    return profile;
  }

  async updateProfile(userId, data) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppException('User not found', 404);
    }

    const { email, password, role, ...allowedData } = data;

    const updatedUser = await userRepository.update(userId, allowedData);

    const { password: __, ...profile } = updatedUser;
    return profile;
  }

  async uploadAvatar(userId, file) {
    if (!file) {
      throw new AppException('No file uploaded', 400);
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;

    await userRepository.update(userId, { avatar: avatarUrl });

    return avatarUrl;
  }
}

module.exports = new ProfileService();
