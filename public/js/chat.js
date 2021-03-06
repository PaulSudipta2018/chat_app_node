const socket = io()

const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


//Template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML

//Options
const { username, room } = Qs.parse(location.search, {ignoreQueryPrefix: true})


socket.on('message', (message) => {
    console.log(message)

    const html = Mustache.render(messageTemplate, {
        username : message.username,
        message : message.text,
        createdAt : moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', (message) => {
    console.log(message)

    const html = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML("beforeend", html)
})

socket.on('roomData' , ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})



$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    //disable send button after sending the message
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (error) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }
        console.log('Message Delivered!')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocaltion not supported by the browser')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {

        obj = {latitude:position.coords.latitude, longitude: position.coords.longitude}

        socket.emit('sendLocation', {
            latitude:position.coords.latitude, 
            longitude: position.coords.longitude
        }, (ack) => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared')
        })

    })

})


socket.emit('join', { username, room }, (error) => {
    if(error){
        alert(error)
        location.href = "/"
    }
    
})