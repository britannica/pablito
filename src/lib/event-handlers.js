const mouseDownHandler = function (evt) {
    if (this.state.drawing || this.state.sticker === null) {
      return this;
    }
  
    // Don't add the next sticker until we placed the current one
    if(this.state._stickerAdded && this.state.sticker.active) {
      return this;
    }
  
    if(this.state._stickerAdded) {
      return this;
    }
  
    const clickPoint = this._canvas.getPointer(evt.e);
    const stickerImgWidth = this.state.sticker.width;
    const stickerImgHeight = this.state.sticker.height;
  
    // Adjust coordinates of sticker placement on canvas so that the sticker is centered on the click coordinates
    clickPoint.x -= stickerImgWidth / 2;
    clickPoint.y -= stickerImgHeight / 2;
  
    return this.placeSticker(clickPoint);
  };
  
  const mouseUpHandler = function () {
    let config = this._config.stickerControls || {};
    let noBorder = config.cornerSize === 0 || !config.hasBorders;
    if(this.state._stickerAdded && this.state.sticker.active && noBorder) {
      this._canvas.setCursor('move');
    }
  
    return this;
  };
  
  const disableSelectabilityHandler = function (evt) {
    if (evt.target instanceof window.fabric.Image) {
      return;
    }
  
    // if the object isn't an image, then it'll be freehand drawing of some sort. Make that item not
    // selectable
    evt.target.selectable = false;
    evt.target.hasControls = false;
    evt.target.hasBorders = false;
    evt.target.active = false;
    this.triggerRender();
  };
  
  /**
   * Event handler to track when a new object is added to the fabric canvas
   * @param {HistoryManager} historyManager The history manager to track the change in
   * @param {Event} fabricEvent An object with a target property, which is a fabric.Object
   * @return {void}
   */
  const recordObjectAddition = function (historyManager, fabricEvent) {
    // During a redo, the HistoryManager will automatically perform the canvas.add for us. We don't
    // want to track history for this addition if it's a redo, because it'll cause duplicates in the
    // stack. This should now be handled by the history manager's isPerformingRedo state.
    // This function should not fire while a redo is being performed (isPerformingRedo is set to true
    // when the history manager's redo method is called and is not set back to false until the promises
    // within the redo method resolve). So whenever an object is added, even if it is the same exact object
    // that is already in the history array because we now know that it is not a redo, it will push 
    // new elements to the history array.
    var serializedTarget = JSON.stringify(fabricEvent.target);
    var objectAlreadyInHistory = historyManager.history
    .reduce((a, b) => a.concat(b), []) // flatten the array
    .filter(historyEvent => historyEvent.type === 'add') // only get add events
    .some(historyEvent => historyEvent.data === serializedTarget); // target is already there?
    
    if(objectAlreadyInHistory && historyManager.isPerformingRedo) {
      return;
    }
    
    historyManager.pushNewFabricObject(fabricEvent.target);
  };
  
  /**
   * Helper function to find the previous value of a particular property on a fabric.Object by
   * trawling through past history
   *
   * @param {HistoryManager} historyManager The history manager, so we can look at changesets
   * @param {fabric.Object} fabricObject The fabric object to check history for
   * @param {String} propertyName The property name to look for a change for
   * @returns {String|Number} The previous value of the property
   */
  const lastPropertyValue = function (historyManager, fabricObject, propertyName) {
    const flattenedHistory = historyManager.history.reduce((a, b) => a.concat(b), []);
    for(var i = flattenedHistory.length - 1; i >= 0; i--) {
      var historyEvent = flattenedHistory[i];
      if(historyEvent.type === 'add' && historyEvent.objectId === fabricObject.stickerbookObjectId) {
        return JSON.parse(historyEvent.data)[propertyName];
      } else if(historyEvent.type === 'change' && historyEvent.data.property === propertyName) {
        return historyEvent.data.newValue;
      }
    }
    return null;
  };
  
  /**
   * Handler to capture a property change on a fabric object, and store in history
   *
   * @param {HistoryManager} historyManager The history manager, for tracking changes
   * @param {Event} fabricEvent An object with a target property, which is a fabric.Object
   * @returns {void}
   */
  const recordPropertyChange = function (historyManager, fabricEvent) {
    const propertyNames = ['scaleX', 'scaleY', 'globalCompositeOperation', 'angle', 'left', 'top'];
    const objectIndex = historyManager.canvas.getObjects().indexOf(fabricEvent.target);
  
    let propertyDeltas = [];
    propertyNames.forEach(function (property) {
      var oldValue = lastPropertyValue(historyManager, fabricEvent.target, property);
      var newValue = fabricEvent.target[property];
      if(oldValue !== newValue) {
        propertyDeltas.push({ property, objectIndex, oldValue, newValue });
      }
    });
    historyManager.pushPropertyChanges(propertyDeltas);
  };
  
  export {
    disableSelectabilityHandler,
    mouseDownHandler,
    mouseUpHandler,
    recordObjectAddition,
    recordPropertyChange
  };
  