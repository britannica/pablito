
<div align="center">
<h1>Pablito</h1>
<blockquote>An HTML 5 drawing library that leverages <a href="http://fabricjs.com" target="_blank">FabricJS</a> for the majority of the features.</blockquote>

<hr />
</div>

## 📖 Original Source Information
This library is based largely off of the [PBS Canvas-Drawing-Tool](https://github.com/pbs/Canvas-Drawing-Tool) and the [PBS fuzz-select](https://github.com/pbs/fuzzy-select) depedency. You can learn more about PBS efforts on their [Open PBS Blog](https://open.pbs.org). The PBS tool and most of it's features are derived from [FabricJS](http://fabricjs.com) the HTML5 canvas library.

It also uses the [JS Library Boilerplate](https://github.com/hodgef/js-library-boilerplate) which makes it super easy to create a library using the latest tooling including [Webpack 4](https://webpack.js.org) and [Babel 7](https://babeljs.io).

## 💻 Changes

This is more or less a straight port of the original library, but updated to use modern tooling in order for more rapid development. We have also added bug-fixes and custom code that makes our own drawing app perform more to our liking. The fuzzy-select package has been removed as a depency and instead moved into the project which while might not be the best practice speeds up our developent process signifigantly. The package is now on [NPMJS](https://www.npmjs.com) and can be brought into your project via a simple `import` statement.

We have also removed the bundling of FabricJS from the library. FabricJS is almost impossible to build on our development machines and would have been a nightmare for our CI servers. We now instead include whatever version of FabricJS we desire in a script tag so that `fabric` is part of `window`.

## 🙋 The Big Question
Why didn't you fork the original project and make pull requests? This is an excellent question. We had first planned on doing that as we believe in contributing to other open source projects. Some of the things we really wanted, like the package to be imported frorm NPM would have been difficult to coordinate with the original developers. We also felt that we were making so many breaking changes that a pull-request into the original project would have been disastrous. Also time, we were on a very tight deadline for the project that makes use of this library.

## ⭐ Features
- Importable from NPM
- ES5 Module
- Multiple brushes
- Ability to control colors
- Ability to add stickers and backgrounds
- Erase tool
- Fill tool
- Undo and Redo
- ...and more

## 📦 Getting Started
Pablito can be installed via NPM or Yarn:

`npm i --save @britannica/pablito`

`yarn add @britannica/pablito`

You must import the library into your code:

`import Pablito from '@britannica/pablito`

Do not forget to import FabricJs using a script tag somewhere in your application we have used [CDNJS](https://cdnjs.com/libraries/fabric.js/) and it has worked well for us:

`<script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/2.4.2/fabric.min.js" integrity="sha256-em+qzEOePf0K/yI0PjRJnAEpxnDvBKEtvbSmDdK1hZM=" crossorigin="anonymous"></script>`

Fabric is a huge library, so we recomend you use the minified build for production.

Initializing a Pablito instance requires that you pass in a config similar to this one taken from the PBS Canvas-Drawing-Tool documentation.

```js
var stickerBook = new Pablito({
  // The containing element for the stickerbook
  container : container,

  // sticker configuration
  stickers: {
    // the available stickers that can be used
    enabled: [
      'path/to/first/image.png',
      'path/to/other/image.png'
    ],

    // styling options for sticker sizing controls (optional)
    controls: {
      cornerColor: 'rgba(0,0,0,0.5)',
      cornerSize: 20,
      hasBorders: true
    },

    // default positioning for stickers (provide whatever you need, the rest defaults to reasonable values)
    defaults: {
      x: 0, // if x and y defaults are not provided, you *must* provide them when calling placeSticker()
      y: 0,
      xScale: 1,
      yScale: 1,
      rotation: 0 // degrees
    }
  },


  background: {
    // the backgrounds that can be set
    enabled: [
        'first/bg.png',
        'other/bg.png'
    ],
    
    // the default background to use (can be null for empty background)
    default: 'first/bg.png'
  },

  brush: {
    // The available brushes. The list below has the all the currently available ones (at the time of writing)
    enabled: [
      'eraser',
      'bitmap',
      'bitmap-eraser',
      'fill',
      'marker',
      'pattern',
      'pencil',
      'spray',

      // a custom brush configured below
      'mycustombrush'
    ], 
    
    // The available brush widths (in pixels)
    widths: [1, 10],

    // The available colors to use, can be any valid CSS color
    colors: [
      '#0000FF',
      '#FF0000'
    ],

    // any custom brushes, the key of this object are the id to be used in the enabled list above, and the value must
    // be a subclass of fabric.BaseBrush (via fabric.util.createClass(fabric.BaseBrush, { }) )
    custom: {
      mycustombrush: MyCustomBrush
    }
  },

  // Whether or not to enable touch events
  mobileEnabled: true,

  // Whether or not to use default event handlers (see "Events" below)
  useDefaultEventHandlers: true
});
```
The rest of the documentation can be found in the [Read Me](https://github.com/pbs/Canvas-Drawing-Tool) file on the PBS Canvas-Drawing-Tool page.

Any additional functionality above and beyond what is listed there we will add here in the future.

## ✅ TODO
- We broke all of the unit tests porting this over, at some point we would like to bring those over as well as time permits.
- Improve performance of the `Fill` algorithm.
- Remove a bunch of unecessary files that [JS Library Boilerplate](https://github.com/hodgef/js-library-boilerplate) helpfully provides, but we don't need.
- If FabricJS ever comes into a state where it can be built by mere mortals we would like to add that as a dependency.

## 👩🏼‍⚖️ Legal Stuff
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.