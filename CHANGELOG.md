# vite-image

## 0.5.3

### Patch Changes

- Another attempt to fix strange problems with TypeScript definitions.

## 0.5.2

### Patch Changes

- _Actually_ fix `TypedImage` not autocompleting keys.

## 0.5.1

### Patch Changes

- Add default value to `TypedImage`.
- Fix `TypedImage` not autocompleting keys.

## 0.5.0

### Minor Changes

- Boolean values can now be inverted. `!flip` will be treated like `flip=false`.

### Patch Changes

- Optimize build/dev mode.
- The plugin's config is now validated via [validate](https://npmjs.org/package/validate).

## 0.4.1

### Patch Changes

- Switch to `rollup-plugin-dts` for TypeScript bundling.
- Fix some transformers not working.

## 0.4.0

### Minor Changes

- The list of applied transformers is now accessible via `export=transformers`.

### Patch Changes

- Speed up transformations by ~17%.

## 0.3.3

### Patch Changes

- Add `TypedImage`, a helper type for TypeScript users.

## 0.3.2

### Patch Changes

- Bug fixes.

## 0.3.1

### Patch Changes

- More small performance improvements.

## 0.3.0

### Minor Changes

- The last lines of `vite-imagetools` code has been removed!

### Patch Changes

- Various performance improvements.
- Updated 2 matchers to speed up overall performance.

## 0.2.1

### Patch Changes

- Automatically publish GitHub/NPM releases.

## 0.2.0

### Minor Changes

- Add 10 new default transformers.
- Create tests for every transformer.

### Patch Changes

- Fix identical images not being detected as identical.

## 0.1.0

### Minor Changes

- b5116c2: Add a new `post_process` step for image transformation.
- b5116c2: Optimize image processing and automatically rotate images.

### Patch Changes

- 2f96680: Remove correct search params.

## 0.0.4

### Patch Changes

- ce17667: Start using @changesets/cli for better releases.
- ce17667: Finally nailed down a pesky import bug.
