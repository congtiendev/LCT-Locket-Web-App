class UserResponseDto {
  constructor(user) {
    this.id = user.id;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
    this.avatar = user.avatar;
    this.phone = user.phone;
    this.status = user.status;
    this.emailVerified = user.emailVerified;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}

module.exports = UserResponseDto;
