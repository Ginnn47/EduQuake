export const clampPan = (value, limit = 42) => Math.min(Math.max(value, -limit), limit);
