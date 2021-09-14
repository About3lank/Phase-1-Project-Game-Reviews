function displayGames() {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(function(data) {
            data.forEach(element => {
                renderGameRow(element)
            });
        })
}

function renderGameRow(e) {
    const gameTable = document.getElementById('game-table')

    const gameRow = mkElement('tr')
    gameRow.id = `gameID-${e.id}`


    const reviewDetails = mkElement('details')
    const commentTitle = mkElement('summary')
    commentTitle.innerText = "Reviews"
    reviewDetails.appendChild(commentTitle)

    e.reviews.forEach( function(r) {
        const review = mkElement('p')
        review.innerText = ""
        for (let i=0; i<5; i++){
            if (i <= r.rating){
                review.innerText += `★`;
            } else {
                review.innerText += `☆`;
            }
        }
        review.innerText += ` - ${r.comment}`
        reviewDetails.appendChild(review)
    })

    const thumbnailCell = mkElement('td')
    const nameCell = mkElement('td')
    const releaseCell = mkElement('td')
    const genreCell = mkElement('td')
    const ratingCell = mkElement('td')
    const reviewCell = mkElement('td')

    const thumbnailImg = mkElement('img')
    thumbnailImg.src = e.image
    thumbnailImg.alt = e.name
    thumbnailImg.className = "thumbnail"
    thumbnailCell.appendChild(thumbnailImg)

    nameCell.innerText = e.name
    releaseCell.innerText = e.release
    genreCell.innerText = e.genre 
    ratingCell.innerText = calculateRating(e)
    reviewCell.append(reviewDetails)


    gameRow.append(thumbnailCell, nameCell, releaseCell, genreCell, ratingCell, reviewCell)
    gameTable.appendChild(gameRow)
}

function calculateRating(e) {
    const numberOfReviews = e.reviews.length
    let ratingTally = 0
    for (let i = 0; i < numberOfReviews; i++) {
        ratingTally += e.reviews[i].rating
    }

    const avgRating = ratingTally / numberOfReviews

    let ratingStars = ""
        for (let i=0; i<5; i++){
            if (i <= avgRating){
                ratingStars += `★`;
            } else {
                ratingStars += `☆`;
            }
        }

    return ratingStars


}

const mkElement = (element) => document.createElement(element)

function init () {
    displayGames()
}

BASE_URL = "http://localhost:3000/games?_embed=reviews"
init()