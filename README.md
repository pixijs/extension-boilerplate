# PixiJS Extension Boilerplate

This is a simple boilerplate project powered by [PixiJS Extension Scripts](https://github.com/pixijs/extension-scripts). It demonstrates how you can create an extension for PixiJS that works with TypeScript, generates all the necessary build files and supports documentation (with webdoc) and unit-testing (with Jest).

## Getting Started

This project assumes you are familiar with `npm`, `node.js` and **package.json** files.

```bash
npm install
npm run build
```

## Structure

| Path | Description |
|---|---|
| `./src` | Folder containing the source code for your extension |
| `./test` | Folder containing the Jest-based unit-tests (i.e., `*.test.ts`) |
| `./examples` | Folder containing any examples to demonstrate usage |
| `./global.d.ts` | TypeScript global mixins for PixiJS |


## Publishing

When you're ready to publish your extension and share with the world, run the following command.
This will ask you which type of version bump you'd like to do and then do all the necessary steps to build
and package your extension.

```bash
npm run release
```