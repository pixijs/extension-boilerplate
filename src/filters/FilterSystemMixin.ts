import { Sprite } from '@pixi/sprite';
import { Container } from '@pixi/display';

function rotateWithin(this: Sprite, width: number, height: number, angle: number) {
    let parent = this.parent;
    angle = angle / 180 * Math.PI;
    if (width !== 0 || height !== 0) {
        this.x = (width - this.width) * (1 + Math.cos(angle)) / 2;
        this.y = (height - this.height) * (1 + Math.sin(angle)) / 2;
    }
}

/**
 * here's how to apply the mixin
 */
export function applyFsMixins(): void {
    // ir is hardly a plugin or is it?
    if (Container && Container.prototype) {
        (Container.prototype as any).rotateWithin = rotateWithin;
    }
}
