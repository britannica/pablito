var now = function() {
  if (window.performance.now instanceof Function) {
    return window.performance.now();
  }

  return Date.now();
};

var marks = {};
var measures = {};

function now() {
  if (window.performance.now instanceof Function) {
    return window.performance.now();
  }

  return Date.now();
}

function mark(name) {
  marks[name] = now();
}

function measure(name, m1, m2) {
  measures[name] = marks[m2] - marks[m1];
}

function all() {
  return {
    marks: marks,
    measures: measures,
  };
}

export {
  now,
  mark,
  measure,
  all,
};
