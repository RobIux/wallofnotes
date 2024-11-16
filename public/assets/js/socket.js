const socket = new io()

let createdNotes = {}

socket.on('notes', (notes)=>{
    Object.keys(notes).forEach(noteID => {
        const note = notes[noteID]
        if (createdNotes[noteID]) return
        createdNotes[noteID] = new Note(note)
    });
})

socket.on('note', (noteID, note)=>{
    if (createdNotes[noteID]) return
    createdNotes[noteID] = new Note(note)
})