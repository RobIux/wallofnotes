import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import fs from 'fs'

const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer)

const limits = {}
const limit = 30

if (!fs.existsSync('notes.json')) {
    fs.writeFileSync('notes.json', "{}")
}

app.use(express.static('public'))
app.use('/assets', express.static('assets'))

io.on('connection', (socket)=>{
    const ipAddress = socket.handshake.headers["x-forwarded-for"].split(",")[0];
    console.log(ipAddress)
    socket.emit('notes', fs.readFileSync('notes.json', { encoding: "utf8" }))

    socket.on('notes', notes=>{
        try {
            if (!limits[ipAddress]) {
                limits[ipAddress] = 0
            }

            limits[ipAddress] += 1

            if (limits[ipAddress] > limit) {
                throw new Error("Limit reached")
            }

            notes = JSON.parse(notes)
            const notesFile = JSON.parse(fs.readFileSync('notes.json', { encoding: "utf8" }))

            Object.keys(notes).forEach(noteID => {
                const note = notes[noteID]
                notesFile[noteID] = note
            });

            fs.writeFileSync('notes.json', JSON.stringify(notesFile, null, 2))
            io.emit('notes', JSON.stringify(notes))
        } catch (err) {
            console.warn("ERROR!", err.message)
        }
    })
})

setInterval(() => {
    console.log(limits)
    Object.getOwnPropertyNames(limits).forEach(function (prop) {
        delete limits[prop];
    });
    console.log('cleared limits')
}, 3.6e+6);

httpServer.listen(4567)