function populateGameDropdown() {
    const menu = document.getElementById('games-dropdown')
    fetch(BASE_URL)
        .then(res => res.json())
        .then(function(data) {
            data.forEach(e => {
                console.log(e.id)
                const option = mkElement('option')
                option.value=`gameID-${e.id}`
                option.innerText = e.name
                menu.appendChild(option)
            })
        })
}


function displayGames() {
    fetch(BASE_URL)
        .then(res => res.json())
        .then(function(data) {
            data.forEach(element => {
                renderGameRow(element)
            });
        })
}

// function renderGameRow(e) {
//     const gameTable = document.getElementById('game-table')

//     const gameRow = mkElement('tr')
//     gameRow.id = `gameID-${e.id}`


//     const reviewDetails = mkElement('details')
//     const commentTitle = mkElement('summary')
//     commentTitle.innerText = "Reviews"
//     reviewDetails.appendChild(commentTitle)

//     e.reviews.forEach(function(r) {
//         const review = mkElement('p')
//         review.innerText = 
//         review.innerText += `${renderStars(r.rating)} ${r.comment}`
//         reviewDetails.appendChild(review)
//     })

//     const thumbnailCell = mkElement('td')
//     const nameCell = mkElement('td')
//     const releaseCell = mkElement('td')
//     const genreCell = mkElement('td')
//     const ratingCell = mkElement('td')
//     const reviewCell = mkElement('td')

//     const thumbnailImg = mkElement('img')
//     thumbnailImg.src = e.image
//     thumbnailImg.alt = e.name
//     thumbnailImg.className = "thumbnail"
//     thumbnailImg.addEventListener('click', function() {
//         const modal = document.getElementById("myModal");
//         const span = document.getElementsByClassName("close")[0];
//         const gameTrailer = document.getElementById("game-trailer");
//         gameTrailer.src = e.trailer;
//         gameTrailer.type= "YouTube video player";
//         gameTrailer.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//         modal.style.display = "block";
//         span.addEventListener('click', function() {
//             modal.style.display = "none";
//         })
//         window.addEventListener('click', function(event) {
//             if (event.target == modal) {
//               modal.style.display = "none";
//             }
//         })
//     })
//     thumbnailCell.appendChild(thumbnailImg)

//     nameCell.innerText = e.name
//     releaseCell.innerText = e.release
//     genreCell.innerText = e.genre
//     const ratingValue = calculateRating(e)
//     ratingCell.innerText = `${renderStars(ratingValue)} (${ratingValue})`
//     reviewCell.append(reviewDetails)


//     gameRow.append(thumbnailCell, nameCell, releaseCell, genreCell, ratingCell, reviewCell)
//     gameTable.appendChild(gameRow)
// }


function calculateRating(e) {
    const numberOfReviews = e.reviews.length
    let ratingTally = 0
    for (let i = 0; i < numberOfReviews; i++) {
        ratingTally += e.reviews[i].rating
    }
    const avgRating = ratingTally / numberOfReviews
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

const mkElement = (element) => document.createElement(element)

function renderReviewForm() {
    populateGameDropdown() 
}

function init() {
    renderReviewForm()
    displayGames()
}

BASE_URL = "http://localhost:3000/games?_embed=reviews"
init()