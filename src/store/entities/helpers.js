
/**
 * Example:
 * data = {
 *   id: 'my_id',
 *   name: 'my name',
 *   nestedField: {
 *     id: 'nested_id',
 *     name: 'nested_name',
 *   }
 *   nestedArrayField: [{
 *     id: 'nested_array_id',
 *     name: 'nested_array_name',
 *   }]
 * }
 * will become:
 * normalizedData = {
 *   id: 'my_id',
 *   name: 'my name',
 *   nestedField: 'nested_id',
 *   nestedArrayField: ['nested_array_id],
 * }
 */
export const normalizeRelations = (data, fields) => {
  return {
    ...data,
    ...fields.reduce((prev, field) => ({
      ...prev,
      [field]: Array.isArray(data[field])
        ? data[field].map(x => x.id)
        : data[field].id,
    }), {}),
  };
}

/**
 * will return:
 * data = {
 *   id: 'my_id',
 *   name: 'my name',
 *   nestedField: 'nested_id',
 *   nestedArrayField: ['nested_array_id],
 * }
 * will become:
 * resolveData = {
 *   id: 'my_id',
 *   name: 'my name',
 *   nestedField: {
 *     id: 'nested_id',
 *     name: 'nested_name',
 *   }
 *   nestedArrayField: [{
 *     id: 'nested_array_id',
 *     name: 'nested_array_name',
 *   }]
 * }
 */
export function resolveRelations(data, fields, selectors) {
  return {
    ...data,
    ...fields.reduce((prev, field) => ({
      ...prev,
      [field]: Array.isArray(data[field])
        ? data[field].map(x => selectors[field]['findById'](x))
        : selectors[field]['findById'](data[field]),
    }), {}),
  };
}

