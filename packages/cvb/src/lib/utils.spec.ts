import { falsyToString, isEmpty } from './utils.js';

describe('falsyToString', () => {
  test('should return a string when given a boolean', () => {
    expect(falsyToString(true)).toBe('true');
    expect(falsyToString(false)).toBe('false');
  });

  test('should return 0 when given 0', () => {
    expect(falsyToString(0)).toBe('0');
  });

  test('should return the original value when given a value other than 0 or a boolean', () => {
    expect(falsyToString('sandbox')).toBe('sandbox');
    expect(falsyToString(2)).toBe(2);
    expect(falsyToString(null)).toBe(null);
  });
});

describe('isEmpty', () => {
  test('should return true if object is empty', () => {
    expect(isEmpty({})).toBe(true);
  });

  test('should return false if object is not empty', () => {
    expect(isEmpty({ prop: 'value' })).toBe(false);
    expect(isEmpty({ prop: undefined })).toBe(false);
  });
});
