io = whole server
socket = particular user that is connected to the server

emit = sending some messages | this event (data)
on = listening to thhat emit message | this event (data)
broadcast = sending message to everyone except yourself | this event (data)
to = for personal chat netween two users
join = for sharing messages finite number of users within a room | such as whatsapp groups

# Examples to understand

io.emit('message1', "hello world");
socket.on("message1", (data) => console.log(data))
socket.emit('message2', "hello world two");
socket.on("message2", (data) => console.log(data))
socket.to(<passing the user id you want personal chat>).emit('message3', "hello world three")
socket.join(room_name)

# to restart nodemon to terminal use <rs> command   