class UpdateUserDto {
  constructor(data) {
    if (data.name) this.name = data.name;
    if (data.email) this.email = data.email;
    if (data.phone) this.phone = data.phone;
    if (data.role) this.role = data.role;
    if (data.status) this.status = data.status;
  }
}

module.exports = UpdateUserDto;
