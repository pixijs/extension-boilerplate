/*!
 * pixi-plugin-example - v1.0.2
 * Compiled Sun, 29 Jan 2017 00:10:51 UTC
 *
 * pixi-plugin-example is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.pixiPicture = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
    renderer.bindVao(quad.vao);
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
    //clamping 0 pixel from left-top side and 1 from top-bottom to reduce border artifact
    //this is our plugin main purpose
    clamp[0] = frame.x / base.width;
    clamp[1] = frame.y / base.height;
    clamp[2] = (frame.x + frame.width) / base.width - 1.0 / base.realWidth;
    clamp[3] = (frame.y + frame.height) / base.height - 1.0 / base.realWidth;
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

    // there are two ways of binding a texture in pixi-v4

    // force texture in unit 0
    renderer.bindTexture(base, 0, true);

    // "SMART" binding, can be a bit faster
    // shaders.uniforms.uSampler = renderer.bindTexture(base);

    quad.vao.draw(this.renderer.gl.TRIANGLES, 6, 0);
};

// render sprite with our stuff
PIXI.WebGLRenderer.registerPlugin('picture', PictureRenderer);
// fallback for canvas, old one
PIXI.CanvasRenderer.registerPlugin('picture', PIXI.CanvasSpriteRenderer);

module.exports = PictureRenderer;

},{"./PictureShader":2}],2:[function(require,module,exports){


/**
 * @class
 * @extends PIXI.Shader
 * @memberof PIXI.extras
 * @param gl {PIXI.Shader} The WebGL shader manager this shader works for.
 */
function PictureShader(gl)
{
    PIXI.Shader.call(this,
        gl,
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n",
        "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\nuniform vec4 uTextureClamp;\nuniform vec4 uColor;\n\nvoid main(void)\n{\n    vec2 textureCoord = clamp(vTextureCoord, uTextureClamp.xy, uTextureClamp.zw);\n    vec4 sample = texture2D(uSampler, textureCoord);\n    gl_FragColor = sample * uColor;\n}\n"
    );
    //do some stuff, like default values for shader
    //dont forget to bind it if you really are changing the uniforms
    this.bind();
    //default tint
    //Its an example, actually PictureRenderer takes care of this stuff
    this.uniforms.uColor = new Float32Array(1,1,1,1);
}

PictureShader.prototype = Object.create(PIXI.Shader.prototype);
PictureShader.prototype.constructor = PictureShader;
module.exports = PictureShader;

},{}],3:[function(require,module,exports){
var myPlugin = {
    PictureRenderer: require('./PictureRenderer')
};

//dump everything into extras

Object.assign(PIXI.extras, myPlugin);

module.exports = myPlugin;

},{"./PictureRenderer":1}]},{},[3])(3)
});


//# sourceMappingURL=pixi-picture.js.map
