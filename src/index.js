// var fabric = require('fabric').fabric;
import fabric from '../deps/fabric';
import Stickerbook from './stickerbook';

window.fabric = fabric.fabric;
window.Stickerbook = Stickerbook;

console.log(window.fabric.version);