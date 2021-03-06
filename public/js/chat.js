
const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML


socket.on('message', (message) => {
    console.log(message)
    const html = Handlebars.compile(messageTemplate)
    $messages.insertAdjacentHTML('beforeend', html({
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    }))
})

socket.on('locationMessage', (message) => {
    console.log(message)
    const html = Handlebars.compile(locationMessageTemplate)
    $messages.insertAdjacentHTML('beforeend', html({
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm a')
    }))
})

document.querySelector('#message-form').addEventListener('submit', (e) => {
    e.preventDefault()

    //disable form & send button
    $messageFormButton.setAttribute('disabled', 'disabled')

    // e -> event, target -> form, message -> name
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        
        //re-enable form & send button
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error){
            return console.log(error)
        }

        console.log('Message delivered')
    })
})

$sendLocationButton.addEventListener('click', () => {
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('location shared!')
        })
    })
})


