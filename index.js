function populateGameDropdown() {
    const menu = document.getElementById('games-dropdown')
    fetch(BASE_URL+"/games?_embed=reviews")
        .then(res => res.json())
        .then(function(data) {
            data.forEach(e => {
                // console.log(e.id)
                const option = mkElement('option')
                option.value=`gameID-${e.id}`
                option.innerText = e.name
                menu.appendChild(option)
            })
        })
}


function displayGames() {
    fetch(BASE_URL+"/games?_embed=reviews")
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
    reviewDetails.className = 'review-details'

    const commentTitle = mkElement('summary')
    commentTitle.innerText = "Reviews"
    reviewDetails.appendChild(commentTitle)

    e.reviews.forEach(function(r) {
        // render out each review's stars and comment
        const review = mkElement('p')
        review.id =r.id;
        review.innerText += `${renderStars(r.rating)} ${r.comment}`

        // add delete button to each review
        const deleteBttn = mkElement('button')
        deleteBttn.className = 'delete-bttn'
        deleteBttn.type = 'button'
        deleteBttn.innerText = 'X'
        deleteBttn.addEventListener('click', function(event) {
            review.remove();
            
            const removeReview = {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            }

            fetch(BASE_URL+"/reviews/"+review.id, removeReview)
        })
        review.appendChild(deleteBttn)
        reviewDetails.appendChild(review)
    })

    // create each cell in the row
    const thumbnailCell = mkElement('td')
    const nameCell = mkElement('td')
    const releaseCell = mkElement('td')
    const genreCell = mkElement('td')
    const ratingCell = mkElement('td')
    const reviewCell = mkElement('td')

    ratingCell.className = 'rating-cell'
    reviewCell.className = 'review-cell'

    // create thumbnail image
    const thumbnailImg = mkElement('img')
    thumbnailImg.src = e.image
    thumbnailImg.alt = e.name
    thumbnailImg.className = "thumbnail"

    // add pop-up link to thumbnail for game trailer
    thumbnailImg.addEventListener('click', function() {
        const modal = document.getElementById("myModal");
        const span = document.getElementsByClassName("close")[0];
        const gameTrailer = document.getElementById("game-trailer");
        gameTrailer.src = e.trailer;
        gameTrailer.type= "YouTube video player";
        gameTrailer.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        modal.style.display = "block";
        span.addEventListener('click', function() {
            gameTrailer.src = "";
            modal.style.display = "none";
        })
        window.addEventListener('click', function(event) {
            if (event.target == modal) {
                gameTrailer.src = "";
              modal.style.display = "none";
            }
        })
    })
    thumbnailCell.appendChild(thumbnailImg)

    // populate name, release, and genre cells with values
    nameCell.innerText = e.name
    releaseCell.innerText = e.release
    genreCell.innerText = e.genre

    gameRow.append(thumbnailCell, nameCell, releaseCell, genreCell, ratingCell, reviewCell)
    gameTable.appendChild(gameRow)

    // populate review cell
    const ratingValue = calculateRating(e)
    const ratingStars = mkElement('p')
    ratingStars.innerText = renderStars(ratingValue)
    const ratingScore = mkElement('p')
    ratingScore.innerText = `(${ratingValue})`
    ratingCell.append(ratingStars, ratingScore)
    reviewCell.append(reviewDetails)
}


function calculateRating(e) {
    const numberOfReviews = e.reviews.length
    let ratingTally = 0
    for (let i = 0; i < numberOfReviews; i++) {
        ratingTally += e.reviews[i].rating
    }
    let avgRating = ratingTally / numberOfReviews
    avgRating = (Math.floor(avgRating * 100)) /100
    return avgRating
}

function renderStars(rating) {
    rating = Math.floor(rating)
    let ratingStars = ""
    for (let i=0; i<5; i++){
        if (i < rating){
            ratingStars += `★`;
        } else {
            ratingStars += `☆`;
        }
    }
    return ratingStars
}

function addFormSubmitHandler() {
    const form = document.getElementById('leave-review')
    form.addEventListener('submit', function(e) {
        e.preventDefault()
        submitForm(e)
        })
}

function submitForm(event) {
    const gameDropDown = document.getElementById('games-dropdown')

    const gameID = gameDropDown.value.split('-')[1]
    const rating = document.querySelector('input[name="star-rating"]:checked').value;
    const comment = document.querySelector('textarea[name="comment"]').value;

    const newReview = {
        rating: +rating,
        comment: comment,
        gameId: +gameID
    }

    const configObj = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newReview)
    }

    fetch(BASE_URL+"/reviews", configObj)
        .then(res => res.json())
        .then(data => updateScore(data))
}

function updateScore(data){
    const rowToUpdate = data.gameId;
    const scoreUpdate = document.querySelector(`#gameID-${rowToUpdate} > td.rating-cell > p:nth-child(2)`)
    const numberOfReviews = document.querySelectorAll(`#gameID-${rowToUpdate} > td.rating-cell > p:nth-child(2)`).length
    let newRating = (scoreUpdate + data.rating) / numberOfReviews
    newRating = (Math.floor(newRating * 100)) /100
    scoreUpdate.text = newRating;
}

const mkElement = (element) => document.createElement(element)

function renderReviewForm() {
    populateGameDropdown() 
    addFormSubmitHandler()
}

function init() {
    renderReviewForm()
    displayGames()
}


// const REVIEWS_URL = "http://localhost:3000"
const BASE_URL = "http://localhost:3000"

init()
