<h1 align="center"><pre>vite-image</pre></h1>
<p align="center" style="font-style: italic; font-weight: bold">
    fast · extensible · powerful
</p>

<br>

With an easily readable search-param-style syntax, `vite-image` brings the image processing of [sharp](https://sharp.pixelplumbing.com/) to the simple API of [vitejs](https://vitejs.dev/).

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
import CoolImage from './cool-image.jpg&width=300,600,900'
```

**IMPORTANT:** Don't use your `public` folder to store images. Imports are based on the *project* `root`, not `public` folder.

<br>

## Examples

A simple example of making multiple image sizes with a single import:

```jsx
<script>
    // Svelte!
    import DogImages from './images/dog.jpg?width=400,700,900'
</script>

{#each DogImages as image}
    <img src={image.src} alt="A happy dog.">
{/each}
```

A slightly more complex version, using `srcset`:

```jsx
<script>
    // A normal vite import as fallback.
    import src from './images/dog.jpg'
    // A special vite-image import.
    import Images from './images/dog.jpg?width=400,500,900'

    // Creates an srcset, with only one line of code!
    // To adjust or add sizes, just change the original import!
    const srcset = Images.map(img => `${img.src} ${img.width}w`).join()
</script>

<img {src} {srcset}>
```

<br>

## Plugin Options

| Name | Default Value | Description |
| :---: | --- | --- |
| `include` | `'**/*.{heic,heif,avif,jpeg,jpg,png,tiff,webp,gif}?*'` | A picomatch pattern to match images against. |
| `exclude` | `''` | Another picomatch pattern, this time excluding images. |
| `deliminator` | `,` | The character used to split multiple values in a query. |
| `transformers` | `[]` | User-specified custom image transformers. |
| `default_exports` | `['src', 'aspect', 'width', 'height', 'format']` | By default, `vite-image` exports these 5 image attributes. [More attributes can be found here.](https://sharp.pixelplumbing.com/api-input#metadata) |
| `post_process` | `images => images` | A function to process images *after* `vite-image` |

<br>

## Default Transformers

| Name | Params | Description |
| :---: | :---: | --- |
| `resize` | `width`, `height` | Resize an image! If only one dimension is specified, `vite-image` will scale the other to keep a consistent aspect ratio. |
| `format` | `format` | Change the format of an image. Specifying multiple formats can help reduce the amount of imports required. |
| `blur` | `blur` | Can be either `true` or a value between 0.3 and 1000. If `true`, `sharp` performs a 3x3 box blur.

<br>

## Roadmap
- [ ] Implement static import of web images.
- [ ] 1-1 implementations of every `sharp` util.
- [ ] React/Vue/Svelte helper component

<br>

## Contributing

For small changes, feel free to open a pull request and solve whatever issue is plaguing you.

For larger changes (API breaking), please file an issue describing what changes should be made and why.

<br>

## Acknowledgments

This project is based on the work done over at [`vite-imagetools`](https://github.com/JonasKruckenberg/imagetools). Many small features (like the dev mode) were inspired by Jonas' work.