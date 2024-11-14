const socket = new io()

window.onerror = alert

const notesGlobal = {}

socket.on('notes', (notes)=>{
    notes = JSON.parse(notes)
    Object.keys(notes).forEach(noteID => {
        if (notesGlobal[noteID]) {
            notesGlobal[noteID].remove()
        }
        const note = notes[noteID]
        const noteElement = document.createElement('div')
        noteElement.classList.add('note')
        noteElement.style.top = `${note.y}px`
        noteElement.style.left = `${note.x}px`
        noteElement.style.transform = `rotate(${note.rotation}deg)`
        noteElement.style.backgroundImage = "url(/assets/images/stickynote-"+colors[note.color]+".png)"
        const preElement = document.createElement('pre')
        preElement.innerText = note.content
        noteElement.appendChild(preElement)
        document.body.appendChild(noteElement)
        notesGlobal[noteID] = noteElement
    });
})

let x = 0
let y = 0

let noteX = 0
let noteY = 0

let mouseX = 0
let mouseY = 0

document.addEventListener('mousemove', (e)=>{
    let scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
	let scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    mouseX = e.clientX
    mouseY = e.clientY
    x = mouseX + scrollLeft
    y = mouseY + scrollTop
})

document.addEventListener('scroll', (e)=>{
    let scrollLeft = (window.pageXOffset !== undefined) ? window.pageXOffset : (document.documentElement || document.body.parentNode || document.body).scrollLeft;
	let scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    x = mouseX + scrollLeft
    y = mouseY + scrollTop
})

setInterval(() => {
	document.getElementById("xy").innerText = `X: ${Math.round(x)} Y:${Math.round(y)}`
})

const colors = ['yellow', 'red', 'blue', 'green', 'purple', 'orange']

let creatingNote = false
let color = 0
let noteElement
let rotation
let typing = false
let noteFocus = null

document.addEventListener('keydown', (e)=>{
    if (e.key == 'n' && creatingNote == false) {
        creatingNote = true
        rotation = (40) * Math.random() - 20
        document.getElementById('trash-can').hidden = false
        noteElement = document.createElement('div')
        noteElement.classList.add('note')
        noteElement.style.transform = `rotate(${rotation}deg)`
        document.body.appendChild(noteElement)
        
        let trashed = false

        const interval = setInterval(() => {
            noteX = x - 100
            noteY = y - 100
            noteElement.style.top = `${noteY}px`
            noteElement.style.left = `${noteX}px`
            if (noteElement.style.backgroundImage != "url(/assets/images/stickynote-"+colors[color]+".png)") {
                noteElement.style.backgroundImage = "url(/assets/images/stickynote-"+colors[color]+".png)"
            }
            if (mouseX > window.innerWidth - 150) {
                if (mouseY > window.innerHeight - 150) {
                    trashed = true
                    noteElement.remove()
                    document.documentElement.click()
                    document.getElementById('trash-can').hidden = true
                    creatingNote = false
                    clearInterval(interval)
                }
            }
        });

        document.addEventListener('click', ()=>{
            if (!trashed) {
                clearInterval(interval)
                document.getElementById('input').showModal()
                typing = true
            }
        }, { once: true })
    } else if (e.key == 'c' && typing == false) {
        color = (color + 1) % colors.length 
    } else if (e.key == 'f' && typing == false) {
        const noteElement = document.querySelectorAll('body > .note')[Math.floor(Math.random() * document.querySelectorAll('body > .note').length)]
        noteElement.scrollIntoView({ 
            behavior: "smooth",
            block: "center",
            inline: "center"
        })
        if (noteFocus) {
            noteFocus.classList.remove('focus')
        }
        noteElement.classList.add('focus')
        noteFocus = noteElement
    }
})

document.getElementById('post-note').addEventListener('click', ()=>{
    socket.emit('notes', JSON.stringify({
        [Date.now().toString()]: {
            x: noteX,
            y: noteY,
            content: document.getElementById('note-input').innerText,
            rotation: rotation,
            color: color
        }
    }))
    noteElement.remove()
    document.documentElement.click()
    document.getElementById('trash-can').hidden = true
    creatingNote = false
    typing = false
    document.getElementById('note-input').innerText = ""
    document.getElementById('input').close()
})

document.getElementById('cancel-note').addEventListener('click', ()=>{
    noteElement.remove()
    document.documentElement.click()
    document.getElementById('trash-can').hidden = true
    creatingNote = false
    typing = false
    document.getElementById('note-input').innerText = ""
    document.getElementById('input').close()
})