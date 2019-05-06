import MaskedShapeRenderer from './masked-shape-renderer';

/**
 * A `fabric.Path` subclass that mixes in masking for its rendering, which
 * allows it to have "erasing powers"
 */
const MaskedPath = window.fabric.util.createClass(window.fabric.Path, MaskedShapeRenderer);

export default MaskedPath;
