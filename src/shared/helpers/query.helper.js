const buildWhereClause = (filters) => {
  const where = {};

  Object.keys(filters).forEach((key) => {
    if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
      where[key] = filters[key];
    }
  });

  return where;
};

const buildSearchClause = (searchTerm, fields) => {
  if (!searchTerm) return {};

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive',
      },
    })),
  };
};

module.exports = {
  buildWhereClause,
  buildSearchClause,
};
