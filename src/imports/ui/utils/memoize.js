// deliniates any functions from strings in a JSON.stringify operation in order to preserve function construction
JSON.stringifyIt = (obj) => {
  return JSON.stringify(obj, function (key, value) {
    if (typeof value === "function") {
      return "/Function(" + value.toString() + ")/";
    }
    if (typeof value === "string") {
      return "/String(" + value.toString() + ")/";
    }
    return value;
  });
};

// reconstructs any functions from JSON.stringifyIt object
JSON.parseIt = (json) => {
  return JSON.parse(json, function (key, value) {
    if (
      typeof value === "string" &&
      value.startsWith("/Function(") &&
      value.endsWith(")/")
    ) {
      value = value.substring(10, value.length - 2);
      var string = value.slice(value.indexOf("(") + 1, value.indexOf(")"));
      if (/\S+/g.test(string)) {
        return new Function(
          string,
          value.slice(value.indexOf("{") + 1, value.lastIndexOf("}"))
        );
      } else {
        return new Function(
          value.slice(value.indexOf("{") + 1, value.lastIndexOf("}"))
        );
      }
    }
    if (
      typeof value === "string" &&
      value.startsWith("/String(") &&
      value.endsWith(")/")
    ) {
      value = value.substring(8, value.length - 2);
    }
    return value;
  });
};

// memoization of any expensive function uses sessionStorage
// calling window.sessionStorage.clear() must happen at all points where the target or args of the expensiveFunction may change
export function memoize(expensiveFunction, target) {
  let cache = JSON.parseIt(window.sessionStorage.getItem(target)) || {};
  return function (...args) {
    if (Object.keys(cache) < 1) {
      let val = expensiveFunction(...arguments);
      window.sessionStorage.setItem(target, JSON.stringifyIt(val));
      return val;
    } else {
      return JSON.parseIt(window.sessionStorage.getItem(target));
    }
  };
}