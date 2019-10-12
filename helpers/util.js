exports.typeOf = function(el) {
  const type = Object.prototype.toString.call(el);
  const name = type.slice(8, -1);
  return name.toLowerCase();
};

exports.hasKey = function(obj, key) {
  return obj.hasOwnProperty(key);
};

exports.isEmpty = function(obj) {
  return Object.keys(obj).length === 0;
};
