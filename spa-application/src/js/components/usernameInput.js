import * as menuBar from './menuBar'

/**
 * Return HTML code of a username input window
 *
 * @returns {string} HTML code to create a window with an input
 */
export function getUsernameInputWindow () {
  return `
  <div class="username-input-window">
    ${menuBar.getMenuBarHTML()}
    <input type="text" id="username-input" name="username-input" value="lukas">
    <button id="username-submit-button" type="submit">
      <i class="fa fa-check-square"></i>
    </button>
  </div>`
}
