/**
 * @author Wuner
 * @date 2020/8/27 15:45
 * @description
 */
Function.prototype.simulationBind = function (otherThis) {
  let splice = Array.prototype.splice;
  let args = splice.call(arguments, 1);
  let oThis = this;
  let OF = function () {};
  let cb = function () {
    args = args.concat(splice.call(arguments, 0));
    return oThis.apply(
      OF.prototype.isPrototypeOf(this) ? this : otherThis,
      args,
    );
  };
  if (this.prototype) {
    OF.prototype = this.prototype;
  }
  cb.prototype = new OF();
  return cb;
};

function a(a, b, c) {
  console.log(1231, this.a, a, b, c);
}

new (a.simulationBind({ a: 123 }, 4, 12))(3);
new (a.bind({ a: 123 }, 4, 12))(3);
