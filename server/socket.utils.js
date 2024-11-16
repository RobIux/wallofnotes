import ratelimiter from './ratelimiter.js'
import { validateNote, sanetizeNote } from './note.utils.js'
import { getAllNotes, pushNoteAndReturnID } from './notes.db.js'

function publishAndBroadcastNote(socket, note) {
    socket.emit('note', pushNoteAndReturnID(note), note)
}

function broadcastCurrentNotes(socket) {
    socket.emit('notes', getAllNotes())
}

function onNewNote(socket, note) {
    if (ratelimiter(socket)) return
    if (!validateNote(note)) return
    publishAndBroadcastNote(socket, sanetizeNote(note))
}

export function newPeer(socket) {
    broadcastCurrentNotes(socket)

    socket.on('note', note => {
        onNewNote(socket, note)
    })
}