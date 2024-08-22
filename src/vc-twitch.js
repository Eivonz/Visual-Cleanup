/* Notify background script to apply modifications */
function handleResponse(message) {
    console.log(`Message from the background script: ${message.response}`);
}
function handleError(error) {
    console.log(`Error: ${error}`);
}

const sending = browser.runtime.sendMessage("initialize-twitch");
sending.then(handleResponse, handleError);