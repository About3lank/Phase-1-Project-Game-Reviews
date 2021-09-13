function displayGames() {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(function(data) {
            data.forEach(element => {
                console.log()
                renderGameCard(element)
            });
        })
}

function renderGameCard(element) {
    const gallery = document.getElementById('games-gallery')
    const box = document.createElement('figure')
    box.className = 'game-box'

    const image = document.createElement('img')
    image.src = element.image
    image.alt = element.name
    image.className = "game-image"

    box.appendChild(image)
    gallery.appendChild(box)
}





function init () {
    displayGames()
}


BASE_URL = "http://localhost:3000/games"
init()