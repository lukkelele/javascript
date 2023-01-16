/**
 * Connection form component
 */

export const connectionFormHTML = `
    <form id="connection-form">
      <p>
        <label>Connect: </label><br>
        <input id="connect_url" type="text" value="wss://courselab.lnu.se/message-app/socket" >
        <input id="connect" type="button" value="Connect">
        <input id="close" type="button" value="Close connection">
      </p>

      <p>
        <label>Send message: </label><br>
        <input id="message" type="text">
        <input id="send-message" type="button" value="Send message">
      </p>

      <p>
        <label>Log: </label><br>
        <div id="output" class="output"></div>
      </p>
    </form>
    <script type="module" src="js/client.js"></script>
`

/**
 * Get the HTML to create a connection form.
 *
 * @returns {string} of connection form HTML
 */
export function getConnectionFormHTML () { return connectionFormHTML }
