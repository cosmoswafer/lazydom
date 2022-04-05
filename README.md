# A Minimalism barebone library to build wep apps in pure JavaScript

For developers who would like to rapidly develope web apps with standard DOM methods.

## Usage

1. Import from GitHub Pages CDN:

`https://jimmy09140456.github.io/lazydom/<module>.js`

Example:

```javascript
<script type="module">
  import {DOM} from 'https://jimmy09140456.github.io/lazydom/dom.js'; //Do
  whatever you want...
</script>
```

2. Clone the `release` branch from GitHub in submodule

Example:

```sh
$ git submodule add https://github.com/jimmy09140456/lazydom.git
```

## Modules

| Modules     | Description                   |
| ----------- | ----------------------------- |
| `dom.js`    | Shortcut for using DOM APIs   |
| `router.js` | Simulate router by anchor url |
