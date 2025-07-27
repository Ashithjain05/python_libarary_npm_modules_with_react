// scalar operations on arrays
const map = (arr, fn) => arr.map(fn);

// 1-5: scalar binary ops (apply to each item)
function add_scalar(arr, k = 0) {
  return map(arr, (x) => x + k);
}
function subtract_scalar(arr, k = 0) {
  return map(arr, (x) => x - k);
}
function multiply_scalar(arr, k = 1) {
  return map(arr, (x) => x * k);
}
function divide_scalar(arr, k = 1) {
  return map(arr, (x) => x / k);
}
function power_scalar(arr, k = 2) {
  return map(arr, (x) => Math.pow(x, k));
}

// 6-12: element-wise unary
function square(arr) {
  return map(arr, (x) => x * x);
}
function sqrt(arr) {
  return map(arr, (x) => Math.sqrt(x));
}
function log(arr) {
  return map(arr, (x) => Math.log(x));
}
function exp(arr) {
  return map(arr, (x) => Math.exp(x));
}
function sin(arr) {
  return map(arr, (x) => Math.sin(x));
}
function cos(arr) {
  return map(arr, (x) => Math.cos(x));
}
function tan(arr) {
  return map(arr, (x) => Math.tan(x));
}

// helpers
const meanVal = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

// 13-16: aggregations return scalar
function mean(arr) {
  return meanVal(arr);
}
function median(arr) {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}
function std(arr) {
  const mu = meanVal(arr);
  const v = meanVal(arr.map((x) => (x - mu) ** 2));
  return Math.sqrt(v);
}
function variance(arr) {
  const mu = meanVal(arr);
  return meanVal(arr.map((x) => (x - mu) ** 2));
}

// 17: cumsum
function cumsum(arr) {
  let sum = 0;
  return arr.map((x) => (sum += x));
}

// 18: zscore
function zscore(arr) {
  const mu = meanVal(arr);
  const s = std(arr) || 1;
  return arr.map((x) => (x - mu) / s);
}

// 19: minmax_scale
function minmax_scale(arr) {
  const mn = Math.min(...arr);
  const mx = Math.max(...arr);
  const d = mx - mn || 1;
  return arr.map((x) => (x - mn) / d);
}

// 20: pct_change
function pct_change(arr) {
  let prev = null;
  return arr.map((x, i) => {
    if (i === 0) return 0;
    return (x - arr[i - 1]) / (arr[i - 1] || 1);
  });
}

module.exports = {
  add_scalar,
  subtract_scalar,
  multiply_scalar,
  divide_scalar,
  power_scalar,
  square,
  sqrt,
  log,
  exp,
  sin,
  cos,
  tan,
  mean,
  median,
  std,
  variance,
  cumsum,
  zscore,
  minmax_scale,
  pct_change,
};
