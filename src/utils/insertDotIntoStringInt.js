BigInt.prototype.setDecimals = function (decimals) {
  if (decimals <= 0) return this.toString();
  const len = this.toString().length;
  const str = "0".repeat(decimals - len + 1 < 0 ? 0 : decimals - len + 1) + this.toString();
  return `${str.substring(0, str.length - decimals)}.${str.substring(str.length - decimals)}`;
};

const a = BigInt(1);

console.log(a.setDecimals(-1)); // 1
console.log(a.setDecimals(0)); //  1
console.log(a.setDecimals(1)); //  0.1
console.log(a.setDecimals(2)); //  0.01
console.log(a.setDecimals(3)); //  0.001
console.log(a.setDecimals(4)); //  0.0001
console.log(a.setDecimals(5)); //  0.00001
