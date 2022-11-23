import format from './format'

import resize from './resize'

import rotate from './rotate'
import flip from './flip'
import flop from './flop'
import sharpen from './sharpen'
import median from './median'
import blur from './blur'
import gamma from './gamma'
import negate from './negate'
import normalize from './normalize'
import threshold from './threshold'
import modulate from './modulate'

import tint from './tint'
import grayscale from './grayscale'
import colorspace from './colorspace'

import metadata from './metadata'


export default [
    format,
    resize,
    rotate, flip, flop, sharpen, median, blur, gamma, negate, normalize, threshold, modulate,
    tint, grayscale, colorspace,
    metadata
]