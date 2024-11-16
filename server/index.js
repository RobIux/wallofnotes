import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { newPeer } from './socket.utils.js'

export function createServer() {
    const app = express()
    const httpServer = http.createServer(app)
    const io = new Server(httpServer)

    app.use(express.static('public'))

    io.on('connection', newPeer)

    return httpServer
}
