# rollup-plugin-resolve-url-objects
Resolve and bundle the contents of a string in new URL().

## Install
```
npm i rollup-plugin-resolve-url-objects
```

## Usage
rollup.config.js
```js
import resolveObjects from "rollup-plugin-resolve-url-objects";

export default {
	input: ["src/main.js"],
	plugins: [resolveObjects()],
	format: "esm", // other formats have not been tested yet
};
```

In your source:
```js
// @rollup-plugin-resolve-url-objects
const url = new URL("./myWorkerScript.js", import.meta.url);
```
at this point you can do anything with the url really, like:
```js
const worker = new Worker(url, {type: "module"});
```
or
```js
const sharedWorker = new SharedWorker(url, {type: "module"});
```

The plugin looks for the first occurrence of `new URL()` after `@rollup-plugin-resolve-url-objects`. It then creates a new chunk from the string found inside the url. This chunk is generated similarly to how rollup handles dynamic imports for instance.

The url is resolved relatively to the file that contains it. So this will likely only work if your url has `import.meta.url` set as second argument. The plugin will still resolve the url if this isn't the case. But since the location of the output is unknown this might fail when you try to run the bundled code.
