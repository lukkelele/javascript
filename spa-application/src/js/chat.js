/**
 * Chat service using WebSockets
 */

import * as menuBar from './components/menuBar'
import * as connectForm from './components/connectionForm'
import * as textBox from './components/textbox'
import * as usernameInput from './components/usernameInput'
import * as Window from './window'

let chatWindowsOpen = 0

/**
 * Create a new chat
 *
 * @param {string} user is the person who is sending locally
 * @param {string} targetUser is the name of user to chat with
 */
export function createChat (user, targetUser = '') {
  chatWindowsOpen += 1
  const usernameInput = document.querySelector('.username-input-window')
  usernameInput.remove()
  // Move focus to the new chat window
  try {
    document.getElementById('focus').removeAttribute('focus')
  } catch (exception) {
    console.log(exception)
  }
  // TODO: id=focus might be unnecessary to insert here
  const chatBox = `
    <div class="chatWindow">
      <div class="users">
        <div id="client">User: ${user}</div>
        <div id="target">Friend: ${targetUser}</div>
      </div>

      <div class="chatText">
  <!-- Chat bubbles -->
      </div>

      <div class="textbox">
        <input class="textarea" type="text">
        <button id="send-message-button" type="submit">
          <i class="fa fa-check-square"></i>
        </button>
        <!-- <input id="send-message-button" type="button" value="Send message"> -->
      </div>

    </div>
    `
  const chatWindow = Window.createNewWindow(chatBox)
  Window.updatePage(chatWindow)
  // Client.setEventHandlers() // FIXME
  setEventHandlers(false)
}

/**
 * Create a window for the chat username input prompt
 */
export function createUsernameInputWindow () {
  Window.updatePage(usernameInput.getUsernameInputWindow())
}

/**
 * Prompt for username
 */
export function promptUsername () {
  createUsernameInputWindow()
  const usernameSubmitButton = document.getElementById('username-submit-button')
  const usernameInput = document.getElementById('username-input')
  usernameSubmitButton.addEventListener('click', () => {
    localStorage.setItem('username', usernameInput.value)
    console.log('Saved username locally -> ', usernameInput.value)
    createChat(usernameInput.value)
  })
}

/**
 * Create a message bubble containing a message
 *
 * @param {string} data is the message to be inside the bubble
 * @returns {string} of the created bubble in HTML format
 */
export function messageBubble (data) {
  const bubble = `
  <div class="bubble">
    <div id="chat-me">
      <div class="user">user</div>
      <div class="timestamp"></div>
      <div class="msg">
        ${data}
      </div>
    </div>
  </div>
  `
  return bubble
}

/**
 * Format and send a chat message
 *
 * @returns {JSON} packet to be sent to the server
 * FIXME: Query selection for multiple windows
 */
export function sendChatMessage () {
  const user = localStorage.getItem('username')
  const textbox = document.querySelector('.textarea')
  const message = textbox.value
  console.log('message: ', message)
  const CHANNEL = 'channel'
  const KEY = 0
  const messagePacket = {
    type: 'message',
    data: message,
    username: user,
    channel: CHANNEL,
    key: KEY
  }
  console.log('Message to be sent to the server: \n', messagePacket)
  return messagePacket
}

/**
 * What to do when user clicks Connect.
 *
 * @param {boolean} connectToServer is set to true by default
 * if user wishes to not connect to server online, enter false
 */
export function setEventHandlers (connectToServer = true) {
  const url = 'ADDRESS'
  console.log('URL: ', url)
  const close = document.querySelector('.close-button')
  const textarea = document.querySelector('.textarea')
  const sendMessage = document.getElementById('send-message-button')
  let websocket

  if (connectToServer) {
    console.log('Connecting to: ' + url)
    const websocket = new WebSocket(url)

    // Handler for when the connection is opened
    websocket.onopen = () => {
      console.log('The websocket is now open ->', websocket)
    }

    // Handler for when the message is received
    websocket.onmessage = (event) => {
      console.log('Receiving message: ' + event.data)
      console.log(event)
    }

    // Handler for when the socket is closed
    websocket.onclose = () => {
      console.log('The websocket is now closed.')
      console.log(websocket)
    }
  }

  // Event handler for sending messages
  sendMessage.addEventListener('click', () => {
    console.log('clicked sendMessage')
    console.log(`Element -> ${event.target}`)
    let currentElement = event.target
    while (currentElement.className.split(' ')[0] !== 'chatWindow') {
      currentElement = currentElement.parentNode
      console.log(currentElement)
    }
    currentElement.scrollIntoView(false)
    const messagePacket = sendChatMessage()
    const chatText = document.querySelector('.chatText')
    chatText.innerHTML += `${messageBubble(messagePacket.data)}`
    // console.log(chatText.innerHTML)

    if (!websocket || websocket.readyState === 3) {
      console.log('The websocket is not connected to a server.')
    } else {
      websocket.send(JSON.stringify(messagePacket))
      console.log('Sending message: ' + messagePacket)
    }
  })

  /**
   * What to do when user clicks Close connection.
   */
  close.addEventListener('click', () => {
    console.log('Closing websocket.')
    websocket.send('Client closing connection by intention.')
    websocket.close()
    console.log(websocket)
  })
}
