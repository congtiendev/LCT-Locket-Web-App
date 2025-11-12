const { successResponse } = require('@utils/response');
const userService = require('../services/user.service');
const HTTP_STATUS = require('@constants/http-status');

class UserController {
  async getAll(req, res, next) {
    try {
      const { page, limit, search, role, status } = req.query;
      const result = await userService.getAll({ page, limit, search, role, status });
      return successResponse(res, result, 'Users retrieved successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getById(id);
      return successResponse(res, user, 'User retrieved successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await userService.create(req.body);
      return successResponse(res, user, 'User created successfully', HTTP_STATUS.CREATED);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.update(id, req.body);
      return successResponse(res, user, 'User updated successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await userService.delete(id);
      return successResponse(res, null, 'User deleted successfully', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Search users
   * GET /api/users/search?q=query
   */
  async searchUsers(req, res, next) {
    try {
      const { q, limit, offset } = req.query;
      const result = await userService.searchUsers(q, { limit, offset });
      return successResponse(res, result, 'Users found', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get user profile by ID
   * GET /api/users/:id/profile
   */
  async getUserProfile(req, res, next) {
    try {
      const { id } = req.params;
      const profile = await userService.getUserProfile(id);
      return successResponse(res, profile, 'User profile retrieved', HTTP_STATUS.OK);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
