const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
};

const pick = (obj, keys) => {
  const result = {};
  keys.forEach((key) => {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  });
  return result;
};

const removeNullUndefined = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));

module.exports = {
  omit,
  pick,
  removeNullUndefined,
};
