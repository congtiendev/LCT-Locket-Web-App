const AppException = require('@exceptions/app.exception');
const { hashPassword } = require('@utils/crypto');
const { paginate } = require('@helpers/pagination.helper');
const userRepository = require('../repositories/user.repository');

class UserService {
  async getAll(params) {
    const { page = 1, limit = 20, search, role, status } = params;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    const result = await userRepository.findMany({
      where,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    return paginate(result.data, result.total, parseInt(page, 10), parseInt(limit, 10));
  }

  async getById(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppException('User not found', 404);
    }

    return user;
  }

  async create(data) {
    const { email, password, name, role } = data;

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppException('Email already exists', 400);
    }

    const hashedPassword = await hashPassword(password);

    const user = await userRepository.create({
      email,
      password: hashedPassword,
      name,
      role: role || 'USER',
    });

    // Remove password from response
    // eslint-disable-next-line no-unused-vars
    const { password: userPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async update(id, data) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppException('User not found', 404);
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new AppException('Email already exists', 400);
      }
    }

    const updatedUser = await userRepository.update(id, data);

    // Remove password from response
    // eslint-disable-next-line no-unused-vars
    const { password: updatedPassword, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async delete(id) {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new AppException('User not found', 404);
    }

    await userRepository.delete(id);
  }
}

module.exports = new UserService();
