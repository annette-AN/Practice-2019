/* Presented by pado & reborn https://github.com/sepalang/pado */
window.promise = (function () {
  'use strict';

  var likePromise = function likePromise(target) {
    return typeof target === "object" && target !== null && typeof target['then'] === "function" && typeof target['catch'] === "function";
  };

  var PromiseClass = Promise;
  var resolveFn = PromiseClass.resolve;
  var rejectFn = PromiseClass.reject;
  var newPromise = function newPromise(fn) {
    return new PromiseClass(function (r, c) {
      var maybeAwaiter = fn(r, c);
      likePromise(maybeAwaiter) && maybeAwaiter.then(r).catch(c);
    });
  };
  var promise = function promise(fn) {
    return newPromise(fn);
  };
  var PromiseFunction = promise;
  var all$1 = Promise.all;
  PromiseFunction.all = all$1;
  var resolve = resolveFn;
  PromiseFunction.resolve = resolve;
  var reject = rejectFn;
  PromiseFunction.reject = reject;

  var defer = function defer() {
    var resolve$$1, reject$$1;
    var promise$$1 = new PromiseClass(function () {
      resolve$$1 = arguments[0];
      reject$$1 = arguments[1];
    });
    return {
      resolve: resolve$$1,
      reject: reject$$1,
      promise: promise$$1
    };
  };
  promise.defer = defer;
  var timeout = function timeout(fn, time) {
    if (typeof fn === "number") {
      return newPromise(function (resolve$$1) {
        return setTimeout(function () {
          return resolve$$1(time);
        }, fn);
      });
    } else {
      return newPromise(function (resolve$$1) {
        return setTimeout(function () {
          return resolve$$1(typeof fn === "function" ? fn() : fn);
        }, time);
      });
    }
  };
  promise.timeout = timeout;
  var valueOf$1 = function valueOf$$1(maybeQ) {
    return newPromise(function (resolve$$1, reject$$1) {
      likePromise(maybeQ) ? maybeQ.then(resolve$$1).catch(reject$$1) : resolve$$1(maybeQ);
    });
  };
  promise.valueOf = valueOf$1;
  var promise$1 = promise;

  var promiseFn = function promiseFn() {
    return promise$1.apply(void 0, arguments);
  };

  promiseFn['resolve'] = resolve;
  promiseFn['reject'] = reject;
  promiseFn['all'] = all$1;
  promiseFn['defer'] = defer;
  promiseFn['timeout'] = timeout;
  promiseFn['valueOf'] = valueOf$1;

  return promiseFn;

}());
