export default class Pablito {
  constructor() {
    console.log('hello, world');
  }
}
// import validate from './validation/validate';
// import stickerbook from './validation/stickerbook.json';
// import pattern from './validation/bitmap-brush.json';
// import bitmap from './validation/bitmap-brush.json';
// import bitmapEraser from './validation/bitmap-brush.json';
// import BitmapBrush from './brushes/bitmap-brush';
// import BitmapEraserBrush from './brushes/bitmap-eraser-brush';
// import FillBrush from './brushes/fill-brush';
// import BackgroundManager from './background-manager';
// import MarkerBrush from './brushes/marker-brush';
// import PatternBrush from './brushes/pattern-brush';
// import PencilEraserBrush from './brushes/pencil-eraser-brush';
// import {
//   disableSelectabilityHandler,
//   mouseDownHandler,
//   mouseUpHandler,
//   recordObjectAddition,
//   recordPropertyChange,
// } from './event-handlers';
// import { calculateInnerDimensions } from './util';
// import HistoryManager from './history-manager';

// const { BaseBrush, CircleBrush, PencilBrush, SprayBrush } = window.fabric;
// const schema = {
//   stickerbook,
//   pattern,
//   bitmap,
//   'bitmap-eraser': bitmapEraser,
// };

// export default class Pablito {
//   /**
//    * Construct new stickerbook
//    * @param {Object} config - configuration options (see docs)
//    * @returns {Object} Stickerbook
//    */
//   constructor(config) {
//     // assign default to the config, if it's missing
//     const configWithDefaults = this._applyDefaultConfigs(config);

//     this.availableBrushes = {
//       bitmap: BitmapBrush,
//       'bitmap-eraser': BitmapEraserBrush,
//       circle: CircleBrush,
//       eraser: PencilEraserBrush,
//       marker: MarkerBrush,
//       pattern: PatternBrush,
//       pencil: PencilBrush,
//       spray: SprayBrush,
//       fill: FillBrush,
//     };

    

//     this._validateConfig(configWithDefaults);

//     // apply any extra available brushes
//     if (configWithDefaults.brush.custom !== undefined) {
//       Object.assign(configWithDefaults, configWithDefaults.brush.custom);
//     }

//     this._config = configWithDefaults;

//     this.state = {
//       brush: configWithDefaults.brush.enabled[0],
//       brushWidth: configWithDefaults.brush.widths[0],
//       brushConfig: {},
//       color: configWithDefaults.brush.colors[0],
//       drawing: true,
//       sticker: null,
//       historyIndex: null,
//     };

//     this.containerElement = configWithDefaults.container;

//     // the background canvas
//     this.backgroundManager = new BackgroundManager(this.containerElement);

//     // fabric requires us to explicitly set and manage height and width.
//     // (http://stackoverflow.com/questions/10581460)

//     this._canvas = this._initializeFabricCanvas(this.containerElement);

//     this.historyManager = new HistoryManager(this._canvas);
//     this._canvas.on('object:added', event => recordObjectAddition(this.historyManager, event));
//     this._canvas.on('object:modified', event => recordPropertyChange(this.historyManager, event));

//     if (this._config.background && this._config.background.default) {
//       this.setBackground(this._config.background.default);
//     }

//     this._updateCanvasState();

//     // responsive logic
//     this.resize = this.resize.bind(this);
//     window.addEventListener('resize', this.resize);

//     // mark destroyed state
//     this.isDestroyed = false;

//     return this;
//   }

//   /**
//    * Applies defaults to a specified config
//    * @param {Object} config The passed config object
//    * @return {Object} An updated config object that has stickerbook config defaults set on it
//    */
//   _applyDefaultConfigs(config) {
//     const background = Object.assign(
//       {
//         enabled: [],
//         default: null,
//       },
//       config.background
//     );

//     const defaults = {
//       mobileEnabled: true,
//       useDefaultEventHandlers: false,
//     };

//     return Object.assign({}, defaults, config, { background });
//   }

//   /**
//    * Initizalizes a configured Fabric.Canvas object within DOM containing element
//    * @param {Object} containerElement - DOM element to build canvas within
//    *
//    * @returns {Object} Fabric.Canvas
//    */
//   _initializeFabricCanvas(containerElement) {
//     const canvasElement = window.fabric.document.createElement('canvas');

//     containerElement.appendChild(canvasElement);

//     const dimensions = calculateInnerDimensions(containerElement);
//     const canvas = new window.fabric.Canvas(canvasElement, {
//       width: dimensions.width,
//       height: dimensions.height,
//       enableRetinaScaling: false,
//       selection: false, // no group selection
//     });

//     // more opinionated handlers, these can be deactivated by implementors
//     if (this._config.useDefaultEventHandlers) {
//       canvas.on('mouse:down', mouseDownHandler.bind(this));
//       canvas.on('mouse:up', mouseUpHandler.bind(this));
//     }

//     // listen for objects to be added, so we can disable things from being selectable
//     canvas.on('object:added', disableSelectabilityHandler.bind(this));

//     return canvas;
//   }

//   /**
//    * Steps canvas back one step in history, if possible
//    *
//    * this method is asynchronous, because we need to give Fabric time to
//    * re-render images
//    *
//    * @returns {Object} Promise, which resolves to the Stickerbook
//    */
//   undo() {
//     return this.historyManager.undo().then(() => this);
//   }

//   /**
//    * Steps canvas forward one step in history, if possible
//    *
//    * @returns {Object} Promise, which resolves to the Stickerbook
//    */
//   redo() {
//     return this.historyManager.redo().then(() => this);
//   }

//   /**
//    * Convenience function to update internal state and trigger update to external
//    * canvas object state
//    * @param {Object} newState - Stickerbook.state keys/values to update
//    *
//    * @returns {Object} Stickerbook
//    */
//   _setState(newState) {
//     this.state = Object.assign(this.state, newState);
//     this._updateCanvasState();
//   }

//   /**
//    * Updates fabric Canvas to match internal `state`
//    *
//    * @returns {Object} Stickerbook
//    */
//   _updateCanvasState() {
//     const BrushClass = this.availableBrushes[this.state.brush];

//     this._canvas.freeDrawingBrush = new BrushClass(this._canvas, this.state.brushConfig);

//     this._canvas.freeDrawingBrush.color = this.state.color;
//     this._canvas.freeDrawingBrush.width = this.state.brushWidth;
//     this._canvas.isDrawingMode = this.state.drawing;

//     // set background image on container
//     this.backgroundManager.setImageSrc(this.state.backgroundImage);
//     this.backgroundManager.render();

//     return this;
//   }

//   /**
//    * Mutates canvas and contained objects in response to resize event
//    * @param {Object} evt - window.resize event
//    *
//    * @returns {Object} Stickerbook
//    */
//   resize() {
//     // theoretically, fabric supports setting CSS dimensions directly
//     // (http://fabricjs.com/docs/fabric.Canvas.html#setDimensions)
//     // however, using that mechanism seems to result in undesireable
//     // scaling behavior: https://github.com/kangax/fabric.js/issues/1270

//     const originalDimensions = {
//       width: this._canvas.width,
//       height: this._canvas.height,
//     };

//     const newDimensions = calculateInnerDimensions(this.containerElement);

//     this._repositionObjects(originalDimensions, newDimensions);

//     this.backgroundManager.resize();
//     this._canvas.setDimensions(newDimensions);

//     return this;
//   }

//   _repositionObjects(originalDimensions, newDimensions) {
//     var scaleFactor = newDimensions.width / originalDimensions.width;

//     this._canvas.getObjects().forEach(object => {
//       object.setScaleX(object.getScaleX() * scaleFactor);
//       object.setScaleY(object.getScaleY() * scaleFactor);
//       object.setLeft(object.getLeft() * scaleFactor);
//       object.setTop(object.getTop() * scaleFactor);
//     });
//   }

//   /**
//    * Validate config object.
//    * @param {Object} config - configuration options
//    *
//    * @returns {Boolean} true if confguration is valid
//    */
//   _validateConfig(config) {
//     validate(schema.stickerbook, config);

//     if (config.brush.custom === undefined) {
//       return true;
//     }

//     Object.keys(config.brush.custom).forEach(key => {
//       if (config.brush.custom[key].prototype instanceof BaseBrush) {
//         return;
//       }

//       // this entry is not an actual fabric brush
//       throw new Error(`Custom brush "${key}" is not an instance of fabric.BaseBrush`);
//     });

//     return true;
//   }

//   /**
//    * Set active brush for painting.
//    * @param {string} brushName - name of the brush to set active
//    * @param {Object} brushConfig - name of the brush to set active
//    * @param {Object.string} brushConfig.patternUrl - name of the brush to set active
//    *
//    * @returns {Object} Stickerbook
//    */
//   setBrush(brushName, brushConfig) {
//     if (this._config.brush.enabled.indexOf(brushName) === -1) {
//       throw new Error(brushName + ' is not a permitted brush');
//     }

//     if (Object.keys(this.availableBrushes).indexOf(brushName) === -1) {
//       throw new Error(brushName + ' is an unknown brush type');
//     }

//     let newState = {
//       brush: brushName,
//       drawing: true,
//     };

//     if (brushConfig) {
//       newState.brushConfig = brushConfig;

//       // if there are validation rules for the brush's configuration, run a quick check
//       if (schema[brushName] !== undefined) {
//         validate(schema[brushName], brushConfig);
//       }
//     }

//     return this._setState(newState);
//   }

//   /**
//    * Set active brush width for painting.
//    * @param {number} pixels - width in pixels for the brush
//    *
//    * @returns {Object} Stickerbook
//    */
//   setBrushWidth(pixels) {
//     if (this._config.brush.widths.indexOf(pixels) === -1) {
//       throw new Error(pixels + ' is not a permitted brush width');
//     }

//     return this._setState({
//       brushWidth: pixels,
//       drawing: true,
//     });
//   }

//   /**
//    * Set active color for painting.
//    * @param {string} color - hex code of color
//    *
//    * @returns {Object} Stickerbook
//    */
//   setColor(color) {
//     if (this._config.brush.colors.indexOf(color) === -1) {
//       throw new Error(color + ' is not a permitted color');
//     }

//     return this._setState({
//       color: color,
//       drawing: true,
//     });
//   }

//   /**
//    * Set sticker for placing. Note that this method is asynchronous because fabric will have to do
//    * a network call to load the image.
//    * @param {string} stickerUrl - URL of image for sticker use
//    *
//    * @returns {Promise<Stickerbook>} A promise that resolves to the stickerbook when the image has
//    *                                 loaded and is ready
//    */
//   setSticker(stickerUrl) {
//     if (this._config.stickers.enabled.indexOf(stickerUrl) === -1) {
//       throw new Error(stickerUrl + ' is not a permitted sticker');
//     }

//     return new Promise(resolve => {
//       fabric.Image.fromURL(stickerUrl, img => {
//         var filter = new window.fabric.Image.filters.Resize();
//         img.filters.push(filter);
//         this._setState({
//           sticker: img,
//           drawing: false,
//           _stickerAdded: false,
//         });

//         resolve(this);
//       });
//     });
//   }

//   enterStickerMode() {
//     this._setState({
//       img: null,
//       _stickerAdded: false,
//       drawing: false,
//     });

//     this._canvas.setCursor('move');
//   }

//   setPan() {
//     throw new Error('not yet implemented: Stickerbook.setPan()');
//   }

//   setZoom() {
//     throw new Error('not yet implemented: Stickerbook.setZoom()');
//   }

//   clear() {
//     this._canvas.clear();
//   }

//   /**
//    * Get a list of all available colors, as hex codes
//    *
//    * @returns {Object[]} array of hex code strings
//    */
//   getAvailableColors() {
//     return this._config.brush.colors;
//   }

//   /**
//    * Get a list of all available sticker images, as urls
//    *
//    * @returns {Object[]} array of sticker image urls
//    */
//   getAvailableStickers() {
//     return this._config.stickers.enabled;
//   }

//   /**
//    * Set background image of canvas
//    * @param {string|null} imageUrl - url to image for background, or null to remove
//    * the background
//    *
//    * @returns {Object} stickerbook
//    */
//   setBackground(imageUrl) {
//     if (!imageUrl) {
//       this.clearBackground();
//       return this;
//     }

//     if (!this._config.background || !(this._config.background.enabled instanceof Array)) {
//       return this;
//     }

//     var backgroundImageIsEnabled = this._config.background.enabled.indexOf(imageUrl) > -1;

//     if (!backgroundImageIsEnabled) {
//       throw new Error(`${imageUrl} is not a permitted background`);
//     }

//     this._setState({
//       backgroundImage: imageUrl,
//     });

//     return this;
//   }

//   /**
//    * Removes any background image for the stickerbook
//    *
//    * @return {Object} stickerbook
//    */
//   clearBackground() {
//     this._setState({
//       backgroundImage: null,
//     });

//     return this;
//   }

//   /**
//    * Get background image of canvas
//    *
//    * @returns {string} url for background image
//    */
//   getBackground() {
//     return this.state.backgroundImage;
//   }

//   /**
//    * Deselects any selected items
//    * @return {Object} stickerbook
//    */
//   deselectAll() {
//     this._canvas.deactivateAll().renderAll();
//     return this;
//   }

//   /**
//    * Exports the stickerbook to a base64 encoded PNG, mimicking the native canvas methods
//    *
//    * @returns {string} A base64 string with the composited image in it
//    */
//   toDataURL() {
//     // deselect anything before exporting so we don't see scaling handles in the exported image
//     this.deselectAll();

//     var dummyCanvas = document.createElement('canvas');
//     dummyCanvas.width = this._canvas.lowerCanvasEl.width;
//     dummyCanvas.height = this._canvas.lowerCanvasEl.height;
//     var dummyContext = dummyCanvas.getContext('2d');

//     dummyContext.drawImage(this.backgroundManager._canvas, 0, 0);
//     dummyContext.drawImage(this._canvas.lowerCanvasEl, 0, 0);

//     return dummyCanvas.toDataURL();
//   }

//   /**
//    * Register a callback on an event
//    *
//    * @param {string} eventName - name of event to listen for
//    * @param {function} handler - callback for event listener
//    *
//    * @return {Object} stickerbook
//    */
//   on(eventName, handler) {
//     this._canvas.on(eventName, handler);
//     return this;
//   }

//   /**
//    * Deregister a callback on an event
//    *
//    * @param {string} eventName - name of event
//    * @param {function} handler - callback to remove
//    *
//    * @return {Object} stickerbook
//    */
//   off(eventName, handler) {
//     this._canvas.off(eventName, handler);
//     return this;
//   }

//   /**
//    * Get topmost sticker (usually the most recently added)
//    *
//    * @return {Object|null} either the topmost sticker object, or null if there
//    * are no stickers
//    */
//   getTopSticker() {
//     const objects = this._canvas.getObjects();
//     // fabric appends to its objects, so the top object is the furthest to
//     // the right
//     for (var i = objects.length - 1; i >= 0; i--) {
//       if (objects[i]._element !== undefined) {
//         return objects[i];
//       }
//     }
//     return null;
//   }

//   /**
//    * Places the current selected sticker programmatically on the canvas
//    * @param {Object} options An object with options for the placement
//    * @param {Number} options.x The x position at which to place the sticker
//    * @param {Number} options.y The y position at which to place the sticker
//    * @param {Number} options.xScale The x scale at which to place the sticker, defaults to 1
//    * @param {Number} options.yScale The y scale at which to place the sticker, defaults to 1
//    * @param {Number} options.rotation How much to rotate the image clockwise in degrees, defaults to
//    *                                  0
//    * @returns {Promise} A promise that resolves to the stickerbook once the image is placed
//    */
//   placeSticker(options) {
//     var defaults = this._config.stickers.defaults;
//     if (this._config.stickers.defaults) {
//       options.x = options.x || defaults.x;
//       options.y = options.y || defaults.y;
//       options.xScale = options.xScale || defaults.xScale;
//       options.yScale = options.yScale || defaults.yScale;
//       options.rotation = options.rotation || defaults.rotation;
//     }

//     options.xScale = options.xScale || 1;
//     options.yScale = options.yScale || 1;
//     options.rotation = options.rotation || 0;

//     if (options.x === undefined || options.y === undefined) {
//       throw new Error('To place a sticker an x and y must be provided if there is no default');
//     }

//     // add the sticker to the internal fabric canvas and reposition
//     this.state.sticker.set({
//       left: options.x,
//       top: options.y,
//       scaleX: options.xScale,
//       scaleY: options.yScale,
//       angle: options.rotation,
//       perPixelTargetFind: true,
//     });
//     this.state.sticker.setCoords();
//     this._canvas.add(this.state.sticker);

//     // if there are any sticker control configs, apply those styles
//     if (this._config.stickers.controls) {
//       var hasBorders = this._config.stickers.controls.hasBorders;
//       if (hasBorders === undefined) {
//         hasBorders = true;
//       }
//       this.state.sticker.set({
//         transparentCorners: false,
//         cornerSize: this._config.stickers.controls.cornerSize,
//         cornerColor: this._config.stickers.controls.cornerColor,
//         hasBorders: hasBorders,
//       });
//     }

//     // make this the only active sticker
//     this._canvas.setActiveObject(this.state.sticker);

//     // update state
//     this._setState({ _stickerAdded: true });

//     // Update scaling lock values
//     var self = this;
//     requestAnimationFrame(function() {
//       self.state.sticker.lockScalingX = false;
//       self.state.sticker.lockScalingY = false;
//     });

//     // re-render
//     return this.triggerRender();
//   }

//   /**
//    * Trigger a canvas render cycle
//    * This is useful for low-level manipulation of objects
//    *
//    * @return {Object} stickerbook
//    */
//   triggerRender() {
//     this._canvas.renderAll();
//     return this;
//   }

//   /**
//    * Destroys the stickerbook, removing global event listeners and dom elements created by the
//    * sticker book
//    * @return {undefined}
//    */
//   destroy() {
//     window.removeEventListener('resize', this.resize);
//     this._canvas.dispose();
//     delete this._canvas;
//     delete this.backgroundManager;
//     while (this.containerElement.firstChild) {
//       this.containerElement.removeChild(this.containerElement.firstChild);
//     }
//     this.isDestroyed = true;
//   }
// }
