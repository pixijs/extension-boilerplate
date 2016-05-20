var PictureShader = require('./PictureShader'),
    glCore = PIXI.glCore;

/**
 * Renderer that clamps the texture so neighbour frames wont bleed on it
 * immitates context2d drawImage behaviour
 *
 * @class
 * @memberof PIXI.extras
 * @extends PIXI.ObjectRenderer
 * @param renderer {PIXI.WebGLRenderer} The renderer this plugin works for
 */
function PictureRenderer(renderer) {
    PIXI.ObjectRenderer.call(this, renderer);
}

PictureRenderer.prototype = Object.create(PIXI.ObjectRenderer.prototype);
PictureRenderer.prototype.constructor = PictureRenderer;

PictureRenderer.prototype.onContextChange = function() {
    var gl = this.renderer.gl;
    this.quad = new PIXI.Quad(gl);
    this.normalShader = new PictureShader(gl);
    this.quad.initVao(this.normalShader);
    this._tempClamp = new Float32Array(4);
    this._tempColor = new Float32Array(4);
};

PictureRenderer.prototype.start = function() {
    //noop
};

PictureRenderer.prototype.flush = function() {
    //noop
};

/**
 * Renders the picture object.
 *
 * @param sprite {PIXI.tilemap.PictureSprite} the picture to render
 */
PictureRenderer.prototype.render = function(sprite) {
    if (!sprite.texture.valid) {
        return;
    }
    //you can add different render modes here
    //multiple shaders and stuff
    this._renderNormal(sprite, this.normalShader);
};

PictureRenderer.prototype._renderNormal = function(sprite, shader) {
    var renderer = this.renderer;
    renderer.bindShader(shader);
    renderer.state.setBlendMode(sprite.blendMode);
    var quad = this.quad;
    var uvs = sprite.texture._uvs;

    //sprite already has calculated the vertices. lets transfer them to quad
    var vertices = quad.vertices;
    for (var i=0;i<8;i++) {
        quad.vertices[i] = sprite.vertexData[i];
    }

    //SpriteRenderer works differently, with uint32 UVS
    //but for our demo float uvs are just fine
    quad.uvs[0] = uvs.x0;
    quad.uvs[1] = uvs.y0;
    quad.uvs[2] = uvs.x1;
    quad.uvs[3] = uvs.y1;
    quad.uvs[4] = uvs.x2;
    quad.uvs[5] = uvs.y2;
    quad.uvs[6] = uvs.x3;
    quad.uvs[7] = uvs.y3;

    //TODO: add baricentric coords here
    quad.upload();

    var frame = sprite.texture.frame;
    var base = sprite.texture.baseTexture;
    var clamp = this._tempClamp;
    //clamping 0.5 pixel from each side to reduce border artifact
    //this is our plugin main purpose
    clamp[0] = frame.x / base.width + 0.5 / base.realWidth;
    clamp[1] = frame.y / base.height + 0.5 / base.realWidth;
    clamp[2] = (frame.x + frame.width) / base.width - 0.5 / base.realWidth;
    clamp[3] = (frame.y + frame.height) / base.height - 0.5 / base.realWidth;
    //take a notice that size in pixels is realWidth,realHeight
    //width and height are divided by resolution
    shader.uniforms.uTextureClamp = clamp;

    var color = this._tempColor;
    PIXI.utils.hex2rgb(sprite.tint, color);
    var alpha = sprite.worldAlpha;
    //premultiplied alpha tint
    //of course we could do that in shader too
    color[0] *= alpha;
    color[1] *= alpha;
    color[2] *= alpha;
    color[3] = alpha;
    shader.uniforms.uColor = color;

    //bind texture to unit 0, our default sampler unit
    renderer.bindTexture(base, 0);
    quad.draw();
};

PIXI.WebGLRenderer.registerPlugin('picture', PictureRenderer);

module.exports = PictureRenderer;
