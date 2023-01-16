/**
 * Textbox component used in chat windows
 */

/**
 * Textbox component.
 *
 * @returns {string} html code of a textbox
 */
export function getTextBoxComponent () {
  return `
    <div class="textbox">
      <input type="text" class="textbox-input">
      <button id="username-submit-button" type="submit">
        <i class="fa fa-check-square"></i>
      </button>
    </div>
  `
}
