class LoginDto {
  constructor(data) {
    this.email = data.email;
    this.password = data.password;
  }
}

module.exports = LoginDto;
