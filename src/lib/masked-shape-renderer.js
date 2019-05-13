// /**
//  * A mixin for renderable shapes to make them erase from the existing canvas,
//  * rather than draw to the canvas
//  */
// 
// /**
//  * Override the constructor, so that it also sets composites correctly
//  * @return {undefined}
//  */
// function initialize() {
//   console.log("initialize")
//     // call the super with the original args
//     var args = Array.prototype.slice.call(arguments, 0);
//     args.unshift('initialize');
//     this.callSuper.apply(this, args);
// 
//     // composite so that it erases
//     this.globalCompositeOperation = 'destination-out';
//   }
// 
//   export {
//     initialize as MaskedShapeRenderer
//   };
// 
/**
 * A mixin for renderable shapes to make them erase from the existing canvas,
 * rather than draw to the canvas
 */
module.exports = {
  /**
   * Override the constructor, so that it also sets composites correctly
   * @return {undefined}
   */
  initialize: function () {
    console.log(arguments)
    // call the super with the original args
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift('initialize');
    this.callSuper.apply(this, args);

    // composite so that it erases
    this.globalCompositeOperation = 'destination-out';
  }
};