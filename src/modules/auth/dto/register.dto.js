class RegisterDto {
  constructor(data) {
    this.name = data.name;
    this.email = data.email;
    this.password = data.password;
  }
}

module.exports = RegisterDto;
