// eslint-disable-next-line @typescript-eslint/triple-slash-reference,spaced-comment
/// <reference path="../global.d.ts" />

import { Rectangle } from '@pixi/core';

/**
 * Global PixiJS namespace.
 * @namespace PIXI
 * @see https://pixijs.download/main/docs/PIXI.html
 */

/**
 * PixiJS's Rectangle class.
 * @class PIXI.Rectangle
 * @see https://pixijs.download/main/docs/PIXI.Rectangle.html
 */

/**
 * Example of a utility function that can be added to PixiJS's Rectangle class.
 * This function expands the rectangle by the given amount. Can also be used
 * to contract the Rectangle.
 *
 * @method expand
 * @memberof PIXI.Rectangle
 * @example
 * import { Rectangle } from 'pixi.js';
 * const rect = new Rectangle(0, 0, 100, 100);
 * rect.expand(10);
 * @param {number} amount - The amount to expand (if greater than 0) or contract (if less than 0)
 * @return {PIXI.Rectangle} Instance for chaining.
 */
function expand(this: Rectangle, amount: number): Rectangle
{
    this.x -= amount;
    this.y -= amount;
    this.width += amount * 2;
    this.height += amount * 2;

    return this;
}

Rectangle.prototype.expand = expand;

export { Rectangle };
