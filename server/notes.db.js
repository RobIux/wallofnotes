import fs from 'fs'

if (!fs.existsSync('notes.json')) {
    fs.writeFileSync('notes.json', "{}")
}

const notes = JSON.parse(fs.readFileSync('notes.json', { encoding: "utf8" }))

export function pushNoteAndReturnID(note) {
    const id = new Date().getTime()
    notes[id] = note
    return id
}

export function getAllNotes() {
    return notes
}


setInterval(() => {
    fs.writeFileSync('notes.json', JSON.stringify(notes, null, 2))
    console.log(`Note(s) saved.`)
}, 10000);