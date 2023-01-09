import { Rectangle } from '@pixi/core';
import '../src/index';

describe('Rectangle', () =>
{
    describe('expand', () =>
    {
        it('should be added to prototype', () =>
        {
            const rect = new Rectangle();

            expect('expand' in rect).toBe(true);
        });

        it('should allow return instance', () =>
        {
            const rect = new Rectangle();

            expect(rect.expand(0)).toBe(rect);
        });

        it('should allow for 0 change', () =>
        {
            const rect = new Rectangle(1, 2, 30, 40);

            rect.expand(0);

            expect(rect.x).toBe(1);
            expect(rect.y).toBe(2);
            expect(rect.width).toBe(30);
            expect(rect.height).toBe(40);
        });

        it('should allow for expand values', () =>
        {
            const rect = new Rectangle(1, 2, 30, 40);

            rect.expand(10);

            expect(rect.x).toBe(-9);
            expect(rect.y).toBe(-8);
            expect(rect.width).toBe(50);
            expect(rect.height).toBe(60);
        });

        it('should allow for contract values', () =>
        {
            const rect = new Rectangle(1, 2, 30, 40);

            rect.expand(-2);

            expect(rect.x).toBe(3);
            expect(rect.y).toBe(4);
            expect(rect.width).toBe(26);
            expect(rect.height).toBe(36);
        });
    });
});
