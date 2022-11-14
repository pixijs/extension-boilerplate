# PixiJS Plugin Boilerplate

Use this project as guidance for creating your own PixiJS plugin.

### Getting Started

1. Clone or fork this repository.
2. Update your `package.json` fields:
  * `name`
  * `author`
  * `description`
  * `version`
  * `contributors`
  * `bundle`
  * `homepage`
  * `bugs`
  * `repository`
3. Update `userConfig` object in `rollup.config.mjs`.
4. Add your source code to the `src` folder.
5. Make sure necessary PixiJS packages in `peerDependencies` and `devDependencies`
6. Modify or remove GlobalMixins from `global.d.ts` (used to mixin types to PixiJS)
7. Check that project builds `npm run build`
8. Write a README, and publish your plugin to npm!

### Tips

* When you make changes and want to republish, you can use `npm run release:[patch|minor|major]` to change version of plugin.
* If you reference `@pixi/layers` or some other plugins, change `rollup.config.mjs` accordingly, otherwise they'll be compiled inside your lib.

## Building

```bash
npm i
npm run build
```

## Vanilla JS

All PixiJS v7 plugins has special `iife` build suited for vanilla JavaScript.
Navigate to `dist/pixi-plugin-boilerplate.js` file.

```html
<script src='lib/pixi.js'></script>
<script src='lib/pixi-plugin-boilerplate.js'></script>
```

All exports can be accessed through `PIXI.plugin` global namespace. Please, do not add plugins to the `PIXI` global, instead use your own (e.g., `PIXI.[namespace]`).
