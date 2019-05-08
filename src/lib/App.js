import Pablo from "./pablo";

class App {
  constructor() {
    const stickerbook = new Pablo({
      container: document.getElementById("stickerbook_container"),
      stickers: {
        enabled: [
          "images/coin.svg",
          "images/playCircle.svg",
          "images/star.svg"
        ],
        controls: {
          cornerColor: "rgba(0,0,0,0.5)",
          cornerSize: 20
        },
        defaultScale: {
          x: 0.5,
          y: 0.75
        }
      },
      background: {},
      brush: {
        widths: [1, 10, 50],
        enabled: [
          "eraser",
          "bitmap",
          "bitmap-eraser",
          "fill",
          "marker",
          "pattern",
          "pencil",
          "spray"
        ],
        colors: ["#00c3f7", "#f41971", "#ffe000"]
      },
      mobileEnabled: true,
      useDefaultEventHandlers: true
    });
    
    const forEach = function(array, callback, scope) {
      for (var i = 0; i < array.length; i++) {
        callback.call(scope, array[i]);
      }
    };

    forEach(document.querySelectorAll('#stickers img'), function(child) {
      child.addEventListener('click', function(event) {
        stickerbook.setSticker(event.target.src);
      });
    });

    forEach(document.querySelectorAll('#brushes button'), function(child) {
      child.addEventListener('click', function() {
        var brushConfig = {};
    
        if (child.name === 'pattern') {
          stickerbook.setBrushWidth(50);
          brushConfig = {
            images: ['images/coin.svg', 'images/star.svg'],
          };
        } else if (child.name === 'bitmap' || child.name === 'bitmap-eraser') {
          stickerbook.setBrushWidth(50);
          brushConfig = { image: 'images/star.svg' };
        } else if (child.name === 'fill') {
          brushConfig = { isAsync: true, stepsPerFrame: 10, partialFill: false };
        }
    
        stickerbook.setBrush(child.name, brushConfig);
      });
    });
    // Wire up the color picker
forEach(document.querySelectorAll('.color'), function(child) {
  child.addEventListener('click', function() {
    stickerbook.setColor(child.name);
  });
});

// Wire up the brush width setter
forEach(document.querySelectorAll('.brush_width'), function(child) {
  child.addEventListener('click', function() {
    stickerbook.setBrushWidth(Number(child.name));
  });
});

// Wire up undo and redo
document.getElementById('undo').addEventListener('click', function() {
  stickerbook.undo();
});
document.getElementById('redo').addEventListener('click', function() {
  stickerbook.redo();
});

  }
}

export default App;
