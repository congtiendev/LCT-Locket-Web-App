class CreateUserDto {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'USER';
    this.phone = data.phone;
  }
}

module.exports = CreateUserDto;
