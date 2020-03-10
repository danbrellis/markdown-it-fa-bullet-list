# markdown-it-fa-bullet-list

A [markdown-it](https://www.npmjs.com/package/markdown-it) plugin to use [font awesome icons in a list](https://fontawesome.com/how-to-use/on-the-web/styling/icons-in-a-list).

[![Build Status](https://travis-ci.org/danbrellis/markdown-it-fa-bullet-list.svg?branch=master)](https://travis-ci.com/github/danbrellis/markdown-it-fa-bullet-list)

## What it does

Adds appropriate classes and font awesome icons to bulleted lists as per the font awesome recommended documentation:

- Adds `.fa-ul` to any bulleted list
- Prepends necessary html to any list item `<span class="fa-li"><i class="fas fa-check-square"></i></span>`

**Note:** This package does not load the necessary font awesome dependencies for styling or SVG conversion. Learn more about add Font Awesome to you project at https://fontawesome.com/start.

## Installation

```sh
npm install --save-dev markdown-it-fa-bullet-list
```

## Usage

Use it the same as a normal markdown-it plugin:

```js
const md = require('markdown-it');
const faBulletedLists = require('markdown-it-fa-bullet-list');

const parser = md().use(faBulletedLists);

let result = parser.render(...); // markdown string containing task list items
```

The default icon is the solid style [check-square](https://fontawesome.com/icons/check-square): `fas fa-check-square`; to change this, pass the desired icon class to the `class` option:

```js
const parser = md().use(faBulletedLists, {class: "fas fa-heart"});
```

## Tests

```sh
npm install
npm test
```

## Credits

Built on concepts from [markdown-it-task-lists](https://github.com/revin/markdown-it-task-lists), Copyright (c) 2016, Revin Guillen.

## License

ISC