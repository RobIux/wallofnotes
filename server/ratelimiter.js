let limits = {}
let limit = 30

export default (socket) => {
    const ipAddress = socket.handshake.address

    limits[ipAddress] = limits[ipAddress] + 1 || 1

    setTimeout(() => {
        limits[ipAddress]--
    }, 360000)

    return limits[ipAddress] > limit
}