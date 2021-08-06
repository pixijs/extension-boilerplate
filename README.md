# PixiJS plugin example

[![Build](https://github.com/pixijs/pixi-plugin-example/workflows/Build/badge.svg)](https://github.com/pixijs/pixi-plugin-example/actions?query=workflow%3A%22Build%22) [![npm version](https://badge.fury.io/js/%40pixi%2Fpixi-plugin-example.svg)](https://badge.fury.io/js/%40pixi%2Fpixi-plugin-example)

This is a demo project with collection of simple hacks for PixiJS.

You can make your own pixi plugin based on this repo.

Algorithms represented in this repo hack several parts of Pixi - you can take those ideas and expand them.

If you are that desperate, you can add use it through npm `pixi-plugin-example:'=version'`, because we do not guarantee any back compatibility! This is not a plugin, its a tutorial! 

## How to make your own plugin for PixiJS

People will like the fact that you want to ease their life with with one line

```
import 'pixi-awesome-plugin'
```

Follow the steps:
1. Clone repo locally
2. Create your own repository and copy all the code there
3. Remove folders from `src`, except those you want to use as base for plugin
4. Remove everything from `examples`, leave examples that is close to what you want
5. Put your code in `src` , example in `examples`, test that it works
6. Replace all `pixi-plugin-example` in `package.json` to your plugin name
7. Change version to `0.1.0` or whatever you want
8. Change UMD namespace and file names in `examples` accordingly
9. Make sure you use only necessary pixi plugins in `peerDependencies` and `devDependencies`, they have to be the same!
10. Add/Remove GlobalMixins from `global.d.ts` to hack pixi interfaces
11. Check that project builds
12. Start web server here (like `http-server -c-1`) and check that example works
13. Write a README, and publish your plugin to npm!

### Extra tips:

1. When you make changes and want to re-publish, you can use `npm run release:patch` to change version of lib.
2. If you reference `@pixi/layers` or some other plugins, change `rollup.config.js` accordingly, otherwise they'll be compiled inside your lib
3. remove all "lint"-related commands from `package.json` if you don't like our code style or it obstructs you
4. Contact Ivan to add your plugin to [PixiJS Wiki](https://github.com/pixijs/pixijs/wiki/v6-Resources)

## List of demos

1. `filters` changing FilterSystem for profit

That's enough for now :)

## How to build

```js
npm i
npm run build
```

## Vanilla JS, UMD build

All pixiJS v6 plugins has special `umd` build suited for vanilla.
Navigate `pixi-plugin-example` npm package, take `dist/pixi-plugin-example.umd.js` file.

```html
<script src='lib/pixi.js'></script>
<script src='lib/pixi-plugin-example.umd.js'></script>
```

Also, you can access CDN link, something like `https://cdn.jsdelivr.net/npm/pixi-plugin-example@latest/dist/pixi-plugin-example.umd.js`

all classes can be accessed through `PIXI.example` package.

## How to contribute

Just make PR.
