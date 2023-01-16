/**
 * Main javascript file
 */

import * as Window from './window'

const windows = document.getElementsByClassName('window')
const desktop = document.getElementById('desktop')

addEventListener('load', Window.updateCallbacks)
