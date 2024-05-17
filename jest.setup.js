// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

global.ResizeObserver = class ResizeObserver {
  cb;
  constructor(cb) {
    this.cb = cb;
  }
  observe() {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
  }
  unobserve() {}
  disconnect() {}
};
