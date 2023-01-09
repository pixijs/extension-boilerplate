/**
 * PixiJS uses a special global type object called GlobalMixins
 * this can be used to add methods to existing PixiJS classes.
 */
declare namespace GlobalMixins {
	interface Rectangle {
		expand(amount: number): this;
	}
}
