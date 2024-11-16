class Note {
    constructor(note) {
        this.x = Number(note.x)
        this.y = Number(note.y)
        this.rotation = Number(note.rotation)
        this.color = String(note.color)
        this.content = String(note.content)

        this.noteElement = document.createElement('div')
        this.noteElement.classList.add('note')

        this.preElement = document.createElement('pre')
        this.noteElement.appendChild(this.preElement)
        
        document.body.appendChild(this.noteElement)

        this.update()
    }

    update() {
        this.noteElement.style.left = `${this.x}px`
        this.noteElement.style.top = `${this.y}px`
        this.noteElement.style.transform = `rotate(${this.rotation}deg)`
        this.noteElement.style.backgroundImage = `url(/assets/images/stickynote-${this.color}.png)`
        this.noteElement.querySelector('pre').innerText = this.content
    }
}