/**
 * Menu bar component
 */

/**
 * Return menu bar html code
 *
 * @returns {string} containing menu bar html code
 */
export function getMenuBarHTML () {
  return `
    <div class="menu-bar" id="menu-bar">
      <div class="title">Title</div>
        <div class="buttons">
          <ul>
            <li><button class="minimize-button"><i class="fa fa-window-minimize"></i></button></li>
            <li><button class="maximize-button"><i class="fa fa-window-maximize"></i></button></li>
            <li><button class="close-button"><i class="fa fa-close"></i></button></li>
          </ul>
        </div>
    </div>
  `
}
