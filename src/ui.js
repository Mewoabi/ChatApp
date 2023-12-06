const roomButtons = document.querySelector('.chat-buttons');
const username = document.getElementById('usernameIn');
const message = document.getElementById('messageIn');
const sendButton = document.querySelector('.sendButton');
const changeUsernameButton = document.querySelector('.changeNameButton');
const currentUser = document.querySelector('.username');
const chatList = document.querySelector('.chatList');

 
function setUiEventListeners(chatRoom) {

    //adding event listerners to the roombuttons
    roomButtons.addEventListener('click', e => {
        if (e.target.id) {
            chatRoom.setRoom(e.target.id);
            chatRoom.getChats();
            console.log(chatRoom);
            username.value = '';
            message.value = '';
        }
    })

    //adding even listeners to the input buttons 
    sendButton.addEventListener('click', e => {
        e.preventDefault();
        if(!message.value || !username.value || !validateInput(message.value)){
            if(!message.value || !validateInput(message.value)){
                showAlert("message field can't be empty");
            }
            else{
                showAlert("username field can't be empty");
            }
        }
        else{
            console.log(message.value)
            chatRoom.sendChat (message.value); 
            chatRoom.addChat(message.value);
            message.value = '';
        }
    })

    changeUsernameButton.addEventListener('click', e => {
        e.preventDefault()
       if(username.value && validateInput(username.value)){
        chatRoom.setUsername(username.value);
        currentUser.textContent = username.value
        console.log(chatRoom);
       }else {
        showAlert("enter a username")
       }
    }) 

    chatList.addEventListener('click', e => {
        e.preventDefault()
        if(e.target.tagName === 'I') {
            console.log(e.target.parentElement.dataset.id)
            chatRoom.removeDoc(e.target.parentElement.dataset.id);
            e.target.parentElement.remove();
        }
    })
 
}

function showAlert(message) {
    var alertBox = document.getElementById("alertBox");
    alertBox.textContent = message;
    // Show alert
    alertBox.style.display = "block";
    setTimeout(function () {
        alertBox.style.opacity = 1;
    }, 10);

    // Hide alert after 3 seconds
    setTimeout(function () {
        alertBox.style.opacity = 0;
    }, 3000);

    // Reset alert after fade out
    setTimeout(function () {
        alertBox.style.display = "none";
    }, 3500);
}

function changeRoomButtonColor (room, color) {
    const buttonToColor = document.getElementById(room);
    const buttonList = document.querySelectorAll('.chat-buttons button');
    const buttonsToUnColor = Array.from(buttonList).filter(button => button.id != room);
    buttonsToUnColor.forEach( button => (button.style.backgroundColor = "rgb(17, 203, 197)"))
    buttonToColor.style.backgroundColor = color;
}

function validateInput(inputValue) {
    inputValue = inputValue.trim();

    // Check if the input is not empty
    if (inputValue.length === 0) {
         return false;
    }
    return true
}

export { setUiEventListeners, showAlert,changeRoomButtonColor }