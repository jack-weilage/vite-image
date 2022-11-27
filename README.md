<div align="center">
    <h1 style="border-bottom: 0"><pre>vite-image</pre></h1>
    <p style="font-style: italic; font-weight: bold">
        fast · extensible · easy
    </p>
</div>

<br>

With an URL-style syntax, `vite-image` brings the image processing power of [`sharp`](https://sharp.pixelplumbing.com/) to the simplicity of [`vitejs`](https://vitejs.dev/).

<br>

## Usage

**`vite.config.js`**
```js
import image from 'vite-image'

export default {
    plugins: [ image() ]
}
```

**`Anywhere inside your project`**
```js
import CoolImage from './cool-image.jpg?width=300,600,900'
```

**IMPORTANT:** Don't use your `public` folder to store images. Imports will be relative to the *project* root (specified in `vite.config.js`), not vite's public folder.

<br>

## Further Explanation

- A param like `?blur` will be treated the same as `?blur=true`.
- A param like `?!blur` will be treated the same as `?blur=false`.
- Passing `true` to a param will (usually) trigger the default action from the corresponding `sharp` function.

<br>

## Examples

A simple example of making multiple image sizes with a single import:

```jsx
<script>
    // Returns 3 images (400px, 700px, 900px)
    import DogImages from './images/dog.jpg?width=400,700,900'
</script>

{#each DogImages as image}
    <img src={image.src} alt="A happy dog.">
{/each}
```

A more complex version, creating a `srcset` with TypeScript:

```tsx
<script lang="ts">
    import type { TypedImage } from 'vite-image'
    // A normal vite import as fallback.
    import src from './images/dog.jpg'
    // A special vite-image import.
    import Images from './images/dog.jpg?width=400,500,900&export=src,width'

    // Creates an srcset, with only one line of code!
    // To adjust or add sizes, just change the original import!
    const srcset = (Images as TypedImage<'src' | 'width'>)
        .map(img => `${img.src} ${img.width}w`)
        .join(', ')
</script>

<img {src} {srcset}>
```

<br>

## Plugin Options

| Name | Default Value | Description |
| :---: | --- | --- |
| `include`         | `'**/*.{heic,heif,avif,jpeg,jpg,png,tiff,webp,gif}?*'` | A picomatch pattern to match images against. |
| `exclude`         | `''`                                                   | Another picomatch pattern, this time excluding images. |
| `deliminator`     | `,`                                                    | The character used to split multiple values in a query. |
| `transformers`    | `[]`                                                   | User-specified custom image transformers. |
| `default_exports` | `['src', 'aspect', 'width', 'height', 'format']`       | By default, `vite-image` exports these 5 image attributes. [More attributes can be found here. (Scroll down to "`info` contains the output image")](https://sharp.pixelplumbing.com/api-output#tobuffer) |
| `post_process`    | `images => images`                                     | A function to process images *after* `vite-image` |

<br>

## Default Transformers

To learn about the default transformers, [click here](TRANSFORMERS.md)

## Return Type

`vite-image` will return a modified `sharp` instance, trimmed down for the web. 3 extra values are included: `aspect` (width / height), `src` (an href pointing to the image), and `transformers` (an array of the transformers applied to the image).

Without any configuration, five values will be returned: `src`, `aspect`, `width`, `height`, and `format`.

There are two ways to modify what's returned:
 1. Change `config.default_exports` (changes settings project-wide).
 2. Add a `export` input, like `image?export=width,height,src`. This will override whatever's in your `config.default_exports`.

Try to trim down your exports to only what's necessary to keep your bundle as small as possible!

### Typescript

To help developers using TypeScript, an easy helper type is included. To use it, just import and supply keys:

```ts
import type { TypedImage } from 'vite-image'

import CustomImages from './images/cool-image?width=500,800,1000&export=width,src'

// Properly typing the import isn't possible as far as I know, but this works well enough.
for (const image of CustomImages as TypedImage<'width' | 'src'>)
{
    console.log('src:', image.src)
    console.log('width:', image.width)
}
```

If you are developing a transformer, the transformer type is also supplied, and can be extended.

```ts
import type { Transformer } from 'vite-image'

export default {
    name: 'test-transformer',
    matcher: (config) => typeof config['foo'] === 'boolean' && typeof config['bar'] === 'string',
    transform: (img, config) => {
        if (config['foo'])
            return img.withMetadata({
                exif: {
                    IFD0: {
                        Copyright: config['bar']
                    }
                }
            })
        return img
    }
} as Transformer<'foo' | 'bar', { foo: boolean, bar: string }>

```

<br>

## Roadmap

- [ ] Implement static import of web images.
- [ ] 1-1 implementations of most `sharp` utils.
  - [ ] Output options
  - [ ] Resizing images
  - [x] Image operations
  - [x] Color manipulation
  - [ ] Channel manipulation
- [ ] React/Vue/Svelte helper component

<br>

## Final Notes

If on Linux, `jemalloc` will improve image processing times by enabling concurrent operations. [This stackoverflow answer](https://stackoverflow.com/a/53412679) explains how to install and use `jemalloc`.

<br>

## Contributing

For small changes, feel free to open a pull request and solve whatever issue is plaguing you.

For larger changes (API breaking), please file an issue describing what changes should be made and why.

<br>

## Acknowledgments

This project is based on the work done over at [`vite-imagetools`](https://github.com/JonasKruckenberg/imagetools). Many small features (like the dev mode) were inspired by Jonas' work.