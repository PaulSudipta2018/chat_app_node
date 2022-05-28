const users  = []

//addUser, removeUser, getUser, getUserInRoom

const addUser = ({ id, username, room }) => {

    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if(!username || !room){
        return {
            error: "Username and Room are required"
        }
    }

    //check for existing user

    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate user name

    if(existingUser){
        return {
            error: "Username is in use"
        }
    }

    //store user

    const user = { id, username, room }
    users.push(user)
    return { user }
}

//removeUser

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

// getUser

const getUser = (id) => {
    return users.find((user) => user.id === id)
}

// getUserInRoom

const getUserInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

//export

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}