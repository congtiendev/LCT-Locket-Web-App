const { faker } = require('@faker-js/faker');

const generateUser = (overrides = {}) => {
  return {
    email: faker.internet.email(),
    password: 'Password123!',
    name: faker.person.fullName(),
    role: 'USER',
    ...overrides,
  };
};

const generateUsers = (count = 5) => {
  return Array.from({ length: count }, () => generateUser());
};

module.exports = {
  generateUser,
  generateUsers,
};
