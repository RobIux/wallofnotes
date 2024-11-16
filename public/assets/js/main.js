const colors = ['yellow', 'red', 'blue', 'green', 'purple', 'orange']
const body = document.body

let state = 'Idle'
let noteInput = document.getElementById('note-input')
let position = {x: 0, y: 0}
let trashcan = document.getElementById('trash-can')
let input = document.getElementById('input')
let previewNote = new Note({
    x: 0,
    y: 0,
    color: 'yellow',
    rotation: 0,
    content: ''
})

document.addEventListener('keydown', (e)=>{
    if (e.key == 'n' && state == 'Idle') {
        state = 'CreatingNote'
        previewNote.rotation = Math.floor(Math.random() * 15)
    } else if (e.key == 'c' && state == 'CreatingNote') {
        previewNote.color = colors[(colors.indexOf(previewNote.color) + 1) % colors.length]
    } else if (e.key == 'f') {
        let randomNote = createdNotes[Object.keys(createdNotes)[Math.floor(Math.random() * Object.keys(createdNotes).length)]]
        randomNote.noteElement.scrollIntoView({ 
            behavior: "smooth",
            block: "center",
            inline: "center"
        })
        randomNote.noteElement.classList.add('focus')
        setTimeout(()=>randomNote.noteElement.classList.remove('focus'), 1000)
    }
});

document.addEventListener('wheel', (e)=>{
    if (state != 'CreatingNote') return
    e.preventDefault()
    previewNote.rotation += Math.sign(e.deltaY) * 15
    previewNote.update()
});

document.addEventListener('mousedown', (e)=>{
    if (state != 'Idle') return
    state = 'Dragging'
})

document.addEventListener('mouseup', ()=>{
    if (state == 'Dragging') state = 'Idle'
    if (state == 'CreatingNote') {
        state = 'WritingNote'
        noteInput.innerText = ''
    }
})

document.getElementById('post-note').addEventListener('click', ()=>{
    socket.emit('note', {
        x: previewNote.x,
        y: previewNote.y,
        content: noteInput.innerText,
        rotation: previewNote.rotation,
        color: previewNote.color
    });
    state = 'Idle'
});

document.getElementById('cancel-note').addEventListener('click', ()=>{
    state = 'Idle'
});

document.addEventListener('mousemove', (e)=>{
    position.x = e.clientX + window.scrollX
    position.y = e.clientY + window.scrollY
	document.getElementById("xy").innerText = `X: ${Math.round(position.x)}, Y: ${Math.round(position.y)}`
    if (state == 'Dragging') window.scrollBy(-e.movementX, -e.movementY)
});

function handleNoteCreation() {
    if (state != 'CreatingNote') return
    let tashCanX = trashcan.offsetLeft + trashcan.offsetWidth / 2
    let tashCanY = trashcan.offsetTop + trashcan.offsetHeight / 2
    if (Math.abs(position.x - tashCanX) < 50 && Math.abs(position.y - tashCanY) < 50) {
        state = 'Idle'
        return
    }
    
    previewNote.x = position.x - 100
    previewNote.y = position.y - 100
    console.log(previewNote.rotation)
    previewNote.update()
}

function animationFrame() {
    body.style.cursor = (['Dragging', 'CreatingNote'].includes(state)) ? 'grabbing' : 'grab'
    trashcan.hidden = state != 'CreatingNote'
    if (input.open && state != 'WritingNote') input.close()
    else if (!input.open && state == 'WritingNote') input.showModal()
    previewNote.noteElement.hidden = !['WritingNote', 'CreatingNote'].includes(state)
    
    if (state == 'CreatingNote') handleNoteCreation()
    
    requestAnimationFrame(animationFrame)
}

animationFrame()