import { DisplayObject } from '@pixi/display';
import { Filter, FilterState, FilterSystem } from '@pixi/core';
import { Matrix, Rectangle } from '@pixi/math';

const tempMatrix = new Matrix();
const tempRect = new Rectangle();

/**
 * Original statement is "Fits by height with determined width and height."
 * I honestly dont understand how it works, but as example for adding a function - its fine.
 *
 * @param rectangle - The rectangle to fit.
 * @param width some number
 * @param height some number
 * @return {Rectangle} Returns itself.
 */
function rectangleFitY(this: Rectangle, rectangle: Rectangle, width: number, height: number): Rectangle
{
    this.x = (rectangle.width - width) / 2;
    this.y = Math.max(this.y, rectangle.y);
    this.width = width;
    this.height = height;

    return this;
}

/**
 * This is a copy of `FilterSystem.push`.
 * We have to add "as any" to everything that is actually private in FilterSystem
 * Also tempRect is not visible but we can make extra variable in this file :)
 *
 * This example is taken from https://www.html5gamedevs.com/topic/47592-how-hack-pixi-in-npm-module-system/
 *
 * Ivan: I dont actually understand the changes here, its just you want a demo? OK i've got it.
 *   Personally, I usually override bounds of my object with `calculateBounds` for it.
 *   If I find projects that have this comment or mention `autoFitY` inside, I'll know about your laziness :)
 */
function pushWithAutoFitY(this: FilterSystem, target: DisplayObject, filters: Array<Filter>)
{
    const renderer = this.renderer;
    const filterStack = this.defaultFilterStack;
    const state = this.statePool.pop() || new FilterState();
    const renderTextureSystem = this.renderer.renderTexture;

    let resolution = filters[0].resolution;
    let multisample = filters[0].multisample;
    let padding = filters[0].padding;

    let autoFit = filters[0].autoFit;
    /**
     * here is the the first part
     */
    const autoFitY: number = (filters[0] as any).autoFitY || 0;
    const autoFitWidth: number = (filters[0] as any).autoFitWidth || 0;
    const autoFitHeight: number = (filters[0] as any).autoFitHeight || 0;
    /**
     * === part1 end
     */

    let legacy = filters[0].legacy;

    for (let i = 1; i < filters.length; i++)
    {
        const filter = filters[i];

        // let's use the lowest resolution
        resolution = Math.min(resolution, filter.resolution);
        // let's use the lowest number of samples
        multisample = Math.min(multisample, filter.multisample);
        // figure out the padding required for filters
        padding = this.useMaxPadding
            // old behavior: use largest amount of padding!
            ? Math.max(padding, filter.padding)
            // new behavior: sum the padding
            : padding + filter.padding;
        // only auto fit if all filters are autofit
        autoFit = autoFit && filter.autoFit;

        legacy = legacy || filter.legacy;
    }

    if (filterStack.length === 1)
    {
        this.defaultFilterStack[0].renderTexture = renderTextureSystem.current;
    }

    filterStack.push(state);

    state.resolution = resolution;
    state.multisample = multisample;

    state.legacy = legacy;

    state.target = target;
    state.sourceFrame.copyFrom(target.filterArea || target.getBounds(true));

    state.sourceFrame.pad(padding);

    if (autoFit)
    {
        const sourceFrameProjected = tempRect.copyFrom(renderTextureSystem.sourceFrame);

        // Project source frame into world space (if projection is applied)
        if (renderer.projection.transform)
        {
            (this as any).transformAABB(
                tempMatrix.copyFrom(renderer.projection.transform).invert(),
                sourceFrameProjected
            );
        }

        state.sourceFrame.fit(sourceFrameProjected);
    }

    /**
     * and here is actual change implementation
     */
    if (autoFitY)
    {
        const sourceFrameProjected = tempRect.copyFrom(renderTextureSystem.sourceFrame);
        // Project source frame into world space (if projection is applied)

        if (renderer.projection.transform)
        {
            (this as any).transformAABB(tempMatrix.copyFrom(renderer.projection.transform).invert(), sourceFrameProjected);
        }

        /**
         * we use custom method in Rectangle that will be defined in sibling file and `global.d.ts`
         */
        state.sourceFrame.fitY(sourceFrameProjected, autoFitWidth, autoFitHeight);
    }
    /**
     * end of change
     */
    (this as any).roundFrame(
        state.sourceFrame,
        renderTextureSystem.current ? renderTextureSystem.current.resolution : renderer.resolution,
        renderTextureSystem.sourceFrame,
        renderTextureSystem.destinationFrame,
        renderer.projection.transform,
    );

    state.renderTexture = this.getOptimalFilterTexture(state.sourceFrame.width, state.sourceFrame.height,
        resolution, multisample);
    state.filters = filters;

    state.destinationFrame.width = state.renderTexture.width;
    state.destinationFrame.height = state.renderTexture.height;

    const destinationFrame = tempRect;

    destinationFrame.x = 0;
    destinationFrame.y = 0;
    destinationFrame.width = state.sourceFrame.width;
    destinationFrame.height = state.sourceFrame.height;

    state.renderTexture.filterFrame = state.sourceFrame;
    state.bindingSourceFrame.copyFrom(renderTextureSystem.sourceFrame);
    state.bindingDestinationFrame.copyFrom(renderTextureSystem.destinationFrame);

    state.transform = renderer.projection.transform;
    renderer.projection.transform = null;
    renderTextureSystem.bind(state.renderTexture, state.sourceFrame, destinationFrame);
    renderer.framebuffer.clear(0, 0, 0, 0);
}

/**
 * here's how to apply the mixin
 */
export function applyFsMixins(): void
{
    // sometimes we need "as any" in those cases
    FilterSystem.prototype.push = pushWithAutoFitY;
    Rectangle.prototype.fitY = rectangleFitY;
}
