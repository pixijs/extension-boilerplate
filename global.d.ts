declare namespace GlobalMixins {
	interface Rectangle {
		fitY(rectangle: import('@pixi/core').Rectangle, width: number, height: number): import('@pixi/core').Rectangle;
	}
}
