function displayGames() {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(function(data) {
            data.forEach(element => {
                console.log()
                renderGameRow(element)
            });
        })
}

function renderGameRow(e) {
    const gameTable = document.getElementById('game-table')

    const gameRow = mkElement('tr')

    const reviewDetails = mkElement('details')
    const commentTitle = mkElement('summary')
    commentTitle.innerText = "Reviews"
    reviewDetails.appendChild(commentTitle)

    e.reviews.forEach( function(r) {
        const review = mkElement('p')
        review.innerText = `(${r.rating}*) - ${r.comment}`
        reviewDetails.appendChild(review)
    })

    const nameCell = mkElement('td')
    const releaseCell = mkElement('td')
    const genreCell = mkElement('td')
    const ratingCell = mkElement('td')
    const reviewCell = mkElement('td')

    nameCell.innerText = e.name
    releaseCell.innerText = e.release
    genreCell.innerText = e.genre 
    ratingCell.innerText = `(${calculateRating(e)}*)`
    reviewCell.append(reviewDetails)
    

    // console.log(ratingCell.innerText)

    gameRow.append(nameCell, releaseCell, genreCell, ratingCell, reviewCell)
    gameTable.appendChild(gameRow)
}

function calculateRating(e) {
    const numberOfReviews = e.reviews.length
    let ratingTally = 0

    for (let i = 0; i < numberOfReviews; i++) {
        ratingTally += e.reviews[i].rating
    }

    return ( ratingTally / numberOfReviews )
}

const mkElement = (element) => document.createElement(element)

function init () {
    displayGames()
}


BASE_URL = "http://localhost:3000/games"
init()