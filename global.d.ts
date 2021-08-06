declare namespace GlobalMixins {
	interface Rectangle {
		fitY(rectangle: import('@pixi/math').Rectangle, width: number, height: number): import('@pixi/math').Rectangle;
	}
}
