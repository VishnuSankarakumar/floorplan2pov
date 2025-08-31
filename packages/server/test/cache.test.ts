import { describe, it, expect } from 'vitest';
import { keyOf } from '../src/cache';

describe('cache key', () => {
  it('changes with prompt and bytes', () => {
    const a = keyOf('hello', Buffer.from('abc'));
    const b = keyOf('hello', Buffer.from('abcd'));
    const c = keyOf('hello!', Buffer.from('abc'));
    expect(a).not.toBe(b);
    expect(a).not.toBe(c);
  });
});
