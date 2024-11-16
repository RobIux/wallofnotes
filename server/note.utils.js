import config from "./config.js"

export function validateNote(note) {
    return (
        typeof(note.x) === 'number' && typeof(note.y) === 'number' &&
        typeof(note.rotation) === 'number' && typeof(note.color) === 'string'
        && typeof(note.content) === 'string'
    )
}

export function sanetizeNote(note) {
    return {
        x: Number(note.x),
        y: Number(note.y),
        color: config.colors.includes(note.color) ? note.color : config.default,
        rotation: Number(note.rotation),
        content: String(note.content)
    }
}