## Output

### `format`

> Force output to a given format.

[Sharp reference](https://sharp.pixelplumbing.com/api-resize#resize)

| Key | Type |
| :-: | :-: |
| `format` | `keyof FormatEnum` |


<br>

## Resizing 

### `resize`

> Resize image to `width`, `height` or `width` x `height`.

[Sharp reference](https://sharp.pixelplumbing.com/api-resize#resize)

| Key | Type |
| :-: | :-: |
| `width` | `number` |
| `height` | `number` |


<br>

## Image Operations

### `rotate`

> Rotate the output image by... an explicit angle

[Sharp reference](https://sharp.pixelplumbing.com/api-operation#rotate)

| Key | Type |
| :-: | :-: |
| `rotate` | `number` |

### `flip`

> Flip the image about the vertical Y axis.

[Sharp reference](https://sharp.pixelplumbing.com/api-operation#flip)

| Key | Type |
| :-: | :-: |
| `flip` | `boolean` |

### `flop`

> Flop the image about the horizontal X axis.

[Sharp reference](https://sharp.pixelplumbing.com/api-operation#flop)

| Key | Type |
| :-: | :-: |
| `flop` | `boolean` |

### `sharpen`

> Sharpen the image.

[Sharp reference](https://sharp.pixelplumbing.com/api-operation#sharpen)

| Key | Type |
| :-: | :-: |
| `sharpen` | `number \| true` |

### `median`

> Apply median filter.

[Sharp reference](https://sharp.pixelplumbing.com/api-operation#median)

| Key | Type |
| :-: | :-: |
| `median` | `number \| true` |

### `blur`

> Blur the image.

[Sharp reference](https://sharp.pixelplumbing.com/api-operation#blur)

| Key | Type |
| :-: | :-: |
| `blur` | `number \| true` |

### `gamma`

> Apply a gamma correction by reducing the encoding (darken) pre-resize at a factor of `1/gamma` then increasing the encoding (brighten) post-resize at a factor of `gamma`. 

[Sharp reference](https://sharp.pixelplumbing.com/api-operation#gamma)

| Key | Type |
| :-: | :-: |
| `gamma` | `number \| true`

### `negate`

> Produce the "negative" of an image.

[Sharp reference](https://sharp.pixelplumbing.com/api-operation#negate)

| Key | Type |
| :-: | :-: |
| `negate` | `boolean` |

### `normalize`

> Enhance output image contrast by stretching its luminance to cover the full dynamic range.

[Sharp reference](https://sharp.pixelplumbing.com/api-operation#normalize)

| Key | Type |
| :-: | :-: |
| `normalize` | `boolean` |

### `threshold`

> Any pixel value greater than or equal to the threshold value will be set to 255, otherwise it will be set to 0.

[Sharp reference](https://sharp.pixelplumbing.com/api-operation#threshold)

| Key | Type |
| :-: | :-: |
| `threshold` | `boolean` |

### `modulate`

> Transforms the image using brightness, saturation, hue rotation, and lightness. Brightness and lightness both operate on luminance, with the difference being that brightness is multiplicative whereas lightness is additive.

[Sharp reference](https://sharp.pixelplumbing.com/api-operation#modulate)

| Key | Type |
| :-: | :-: |
| `brightness` | `number` |
| `saturation` | `number` |
| `hue` | `number` |
| `lightness` | `number` |


<br>

## Color Manipulation

### `tint`

> Tint the image using the provided chroma while preserving the image luminance. An alpha channel may be present and will be unchanged by the operation.

[Sharp reference](https://sharp.pixelplumbing.com/api-colour#tint)

| Key | Type |
| :-: | :-: |
| `tint` | `string` |

### `grayscale`

> Convert to 8-bit greyscale; 256 shades of grey.

[Sharp reference](https://sharp.pixelplumbing.com/api-colour#greyscale)

| Key | Type |
| :-: | :-: |
| `grayscale` | `boolean` |

### `colorspace`

> Set the output colourspace. By default output image will be web-friendly sRGB, with additional channels interpreted as alpha channels.

[Sharp reference](https://sharp.pixelplumbing.com/api-colour#tocolourspace)

| Key | Type |
| :-: | :-: |
| `colorspace` | `string` |