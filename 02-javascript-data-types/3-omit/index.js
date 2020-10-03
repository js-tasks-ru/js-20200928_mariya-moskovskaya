/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
  const dest = {};
  for (const [key, value] of Object.entries(obj)) {
    if (!fields.includes(key)) {
      dest[key] = value;
    }
  }
  return dest;
};
