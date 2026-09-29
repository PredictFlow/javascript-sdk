import { describe, it, expect } from 'vitest';
import { SDK_VERSION } from '../../src/index';

describe('PredictFlow SDK Initialization', () => {
  it('should export the current SDK version', () => {
    expect(SDK_VERSION).toBe('0.1.0');
  });
});
