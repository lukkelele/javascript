/**
 * Movable windows and their properties are contained in here
 */

import * as menuBar from './components/menuBar'
import * as MemoryGame from './memoryGame'
import * as Chat from './chat'

export const desktop = document.getElementById('desktop')
const windows = document.getElementsByClassName('window')

/**
 * Create a new window and insert some data into it
 * TODO: FIX ME
 *
 * @param {string} data is the html code to be inserted to the window
 * @param {Array} size is the x and y size of the window
 */
export function createNewWindow (data = '', size = (420, 420)) {
  resetFocus()
  updatePage(
  `
  <div class="window" id="focus" draggable="true">
    <div class="state"></div>
    ${menuBar.getMenuBarHTML()}
    ${data}
  </div>
    `)
}

/**
 * Reset the focus for windows.
 * Used whenever creating new windows or a the focus id shall be directed
 * somewhere else
 */
export function resetFocus () {
  const focusedWindow = document.getElementById('focus')
  if (focusedWindow !== null) {
    focusedWindow.removeAttribute('id')
  }
}

/**
 * Create a new chat window
 *
 * @param {string} data is initial data in a chat window
 * @returns {string} new chat window
 */
export function createNewChatWindow (data = '') {
  return `
    <div class="window chatWindow">
      ${menuBar.getMenuBarHTML()}
      <div class="chatInput">
        <input id="message" type="text">
        <input id="send-message-button" type="button" value="Send message">
      </div>
    </div>
  `
}

/**
 * Create icons
 */
export function createIcons () {
  updatePage(`
  <button class="new-window-button"><i class="fa fa-user-circle"></i>New window</button>
  <button class="icon" id="memory-game-button"><i class="fa fa-question"></i></button>
  <button class="icon" id="chat-button"><i class="fa fa-inbox"></i></button>
    `)
}

/**
 * Event handler for window focus
 *
 * @param {Event} event is the event to be handled
 */
function windowFocusHandler (event) {
  const currentWindow = event.target
  const windows = document.querySelectorAll('.window')
  const windowsArray = Array.prototype.slice.call(windows)
  // Remove the focus attribute from all other windows
  const otherWindows = windowsArray.filter(w => w !== currentWindow)
  otherWindows.forEach(otherWindow =>
    otherWindow.removeAttribute('id')
  )
  currentWindow.setAttribute('id', 'focus')
}

/**
 * Dragstart event handler
 *
 * @param {Event} event is the event to be handled
 */
function dragstartHandler (event) {
  const currentWindow = event.target
  resetFocus()
  currentWindow.classList.add('dragged')
  currentWindow.setAttribute('id', 'focus')
  event.dataTransfer.dropEffect = 'move'

  const style = window.getComputedStyle(event.target, null)
  const x = parseInt(style.getPropertyValue('left'), 10) - event.clientX
  const y = parseInt(style.getPropertyValue('top'), 10) - event.clientY
  // Remember the original position
  event.dataTransfer.setData('text/plain',
    (parseInt(style.getPropertyValue('left'), 10) - event.clientX) + ',' +
    (parseInt(style.getPropertyValue('top'), 10) - event.clientY)
  )
}

/**
 * Update window callbacks
 */
export function setWindowsCallbacks () {
  const windows = document.querySelectorAll('.window')
  const windowsArray = Array.prototype.slice.call(windows)

  for (let i = 0; i < windows.length; i++) {
    const currentWindow = windows[i]

    // To distinguish between multiple open windows
    currentWindow.addEventListener('click', windowFocusHandler)

    // currentWindow.addEventListener('dragstart', (event) => {
    currentWindow.addEventListener('dragstart', dragstartHandler)

    currentWindow.addEventListener('dragend', () => {
      currentWindow.classList.remove('dragged')
    })

    desktop.addEventListener('drop', (event) => {
      event.preventDefault()
      // Select only the currently dragged window
      const windowClasses = [...currentWindow.classList]
      if (windowClasses.includes('dragged')) {
        const offset = event.dataTransfer.getData('text/plain').split(',')
        currentWindow.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px'
        currentWindow.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px'
      }
    })

    desktop.addEventListener('dragenter', (event) => {
      event.preventDefault()
    })

    desktop.addEventListener('dragover', (event) => {
      event.preventDefault()
    })
  }
}

/**
 * TODO: Try to close connection when close button is pressed
 *       Write javadoc as well
 */
export function closeWindow () {
  let focusedWindow = document.querySelector('#focus')
  let target = event.target.parentNode
  // Check if the element is a window
  while (target.className.split(' ')[0] !== 'window') {
    target = target.parentNode
  }
  if (target !== focusedWindow) {
    // Start focusing the window where the button was pressed
    if (focusedWindow !== null) {
      focusedWindow.removeAttribute('id')
    }
    target.setAttribute('id', 'focus')
    focusedWindow = target
    // console.log('Target set to focus: ', target)
  }
  // Set focus to another window
  focusedWindow.remove()
  updateCallbacks()
}

/**
 * The desktop icons callbacks.
 * For the Memory game, new chats and other desktop icons
 */
export function setDesktopIconCallbacks () {
  const memoryGameIcon = document.getElementById('memory-game-button')
  memoryGameIcon.addEventListener('click', MemoryGame.startMemoryGame)
  const chatIcon = document.getElementById('chat-button')
  chatIcon.addEventListener('click', Chat.promptUsername)
}

/**
 * New window
 */
export function newWindow () {
  const desktop = document.getElementById('desktop')
  const desktopBackup = desktop.innerHTML
  const newWindowHTML = createNewWindow()
  desktop.innerHTML += newWindowHTML
  // console.log(desktop.innerHTML)
  updateCallbacks()
}

/**
 * Update the callbacks for the close buttons
 */
export function setCloseButtonCallbacks () {
  const closeButtons = document.getElementsByClassName('close-button')
  // console.log('Updating close buttons')
  for (let k = 0; k < closeButtons.length; k++) {
    const btn = closeButtons[k]
    btn.addEventListener('click', closeWindow)
  }
}

/**
 * Update new window buttons
 */
export function setNewWindowButtons () {
  const newWindowButtons = document.getElementsByClassName('new-window-button')
  // console.log('Updating new window buttons!')
  for (let i = 0; i < newWindowButtons.length; i++) {
    const btn = newWindowButtons[i]
    btn.addEventListener('click', newWindow)
  }
}

/**
 * Update the inner HTML of the desktop element
 * This is in a separate function because of necessary
 * updates to the event handlers.
 *
 * @param {string} data is the html data which is to be updated
 * to the page
 */
export function updatePage (data = '') {
  const pageBackup = desktop.innerHTML
  localStorage.setItem('pageBackup', pageBackup)
  desktop.innerHTML += data
  updateCallbacks()
}

/**
 * Update button event handlers
 */
export function updateCallbacks () {
  setWindowsCallbacks()
  setCloseButtonCallbacks()
  setNewWindowButtons()
  setDesktopIconCallbacks()
}
