import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import fs from 'fs'

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer)

if (!fs.existsSync('notes.json')) {
    fs.writeFileSync('notes.json', "{}")
}

app.use(express.static('public'))
app.use('/assets', express.static('assets'))

io.on('connection', (socket)=>{
    console.log("connected")
    // console.log(fs.readFileSync('notes.json', { encoding: "utf8" }))
    socket.emit('notes', fs.readFileSync('notes.json', { encoding: "utf8" }))

    socket.on('notes', notes=>{
        try {
            notes = JSON.parse(notes)
            const notesFile = JSON.parse(fs.readFileSync('notes.json', { encoding: "utf8" }))

            Object.keys(notes).forEach(noteID => {
                const note = notes[noteID]
                notesFile[noteID] = note
            });

            fs.writeFileSync('notes.json', JSON.stringify(notesFile, null, 2))
            io.emit('notes', JSON.stringify(notes))
        } catch (err) {
            console.warn("ERROR!", err)
        }
    })
})

httpServer.listen(4567)