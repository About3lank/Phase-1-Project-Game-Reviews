function populateGameDropdown() {
    // access dropdown menu (select #games-dropdown element)
    const menu = document.getElementById('games-dropdown')

    // GET list of games from JSON database server to populate the review form's game menu
    fetch(BASE_URL+"/games?_embed=reviews")
        .then(res => res.json())
        .then(function(data) {
            
            data.forEach(e => {
                //create menu option element for each game
                const option = mkElement('option')

                // interpolate id values (to avoid overlap) and label options with plain text
                option.value=`gameID-${e.id}`
                option.innerText = e.name

                // append options to the menu
                menu.appendChild(option)
            })
        })
}

function displayGames() {
    // GET data from JSON database server with fetch request
    fetch(BASE_URL+"/games?_embed=reviews")
        .then(res => res.json())
        .then(function(data) {

            for (let i=0;i<data.length;i++) {
                // store data in local memory for optimistic rendering functionality
                localData.push(data[i])

                // render data so that each game occupies a row in the table #game-table element
                renderGameRow(data[i])
            }
        })
}

function renderGameRow(e) {
    const gameTable = document.getElementById('game-table')

    // create row
    const gameRow = mkElement('tr')
    gameRow.id = `gameID-${e.id}`
    gameRow.className = "game-row"

    // create each cell in the row
    const thumbnailCell = mkElement('td')
    const nameCell = mkElement('td')
    const releaseCell = mkElement('td')
    const genreCell = mkElement('td')
    const ratingCell = mkElement('td')
    ratingCell.className = 'rating-cell'
    const reviewCell = mkElement('td')
    reviewCell.className = 'review-cell'


    // create thumbnail image
    const thumbnailImg = mkElement('img')
    thumbnailImg.src = e.image
    thumbnailImg.alt = e.name
    thumbnailImg.className = "thumbnail"

    // add pop-up link to thumbnail for game trailer
    thumbnailImg.addEventListener('click', function() {
        addModalEvent(e)
    })
    thumbnailCell.appendChild(thumbnailImg)

    // populate name, release, and genre cells with values
    nameCell.innerText = e.name
    releaseCell.innerText = e.release
    genreCell.innerText = e.genre

    // populate rating cell
    populateRatingCell(e, ratingCell)

    // populate review details
    const reviewDetails = mkElement('details')
    reviewDetails.className = 'review-details'
    const commentTitle = mkElement('summary')
    commentTitle.innerText = "Reviews"
    reviewDetails.appendChild(commentTitle)
    

    for (let i=0; i<e.reviews.length; i++) {
        const review = renderReview(e.reviews[i])
        reviewDetails.appendChild(review)
    }

    reviewCell.append(reviewDetails)

    // append cells to row
    gameRow.append(thumbnailCell, nameCell, releaseCell, genreCell, ratingCell, reviewCell)

    // append row to table
    gameTable.appendChild(gameRow)
}

function populateRatingCell(e, ratingCell) {
    // remove HTML elements presently occupying the rating cell
    while (ratingCell.firstChild) {
        ratingCell.removeChild(ratingCell.firstChild)
    }

    // calculate average rating of game's reviews
    const avgRating = calculateRating(e)

    // render string of stars corresponding to the average rating
    const ratingStars = mkElement('p')
    ratingStars.innerText = renderStars(avgRating)

    // render string corresponding to the average rating
    const ratingScore = mkElement('p')
    ratingScore.innerText = `(${avgRating})`

    // append stars and test to rating cell
    ratingCell.append(ratingStars, ratingScore)
}

function addModalEvent(e) {
    const modal = document.getElementById("myModal");
    const span = document.getElementsByClassName("close")[0];

    // define element for embedded video using link from JSON database
    const gameTrailer = document.getElementById("game-trailer");
    gameTrailer.src = e.trailer;
    gameTrailer.type= "YouTube video player";
    gameTrailer.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    modal.style.display = "block";

    // add event listener for X (close) click event
    span.addEventListener('click', function() {
        gameTrailer.src = "";
        modal.style.display = "none";
    })

    // add event listener for click event outside of pop-up window
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            gameTrailer.src = "";
          modal.style.display = "none";
        }
    })}

function renderReview(r) {
    // render each review's stars and comment
    const review = mkElement('p')
    review.id =r.id;
    review.value = r.rating
    review.innerText += `${renderStars(r.rating)} ${r.comment} `

    // add delete button to each review
    const deleteBttn = mkElement('button')
    deleteBttn.className = 'delete-bttn'
    deleteBttn.type = 'button'
    deleteBttn.innerText = 'X'
    // add event listener to delete button
    deleteBttn.addEventListener('click', function() {

        // define functionality for delete button click event
        review.remove();

        // assemble configuration object for fetch call
        const removeReview = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        // send fetch to delete review in JSON server database
        fetch(BASE_URL+"/reviews/"+review.id, removeReview)

        // delete review in localData for optimistic render
        // store object containing review data and destination cell in variables
        const ratingCell = document.querySelector(`#gameID-${r.gameId} > td.rating-cell`)
        const gameID = r.gameId
        const reviewsObj = localData[gameID- 1]
        // iterate over game's reviews to delete the proper review in localData for optimistic render
        for (let i=0; i<reviewsObj.reviews.length; i++) {

            if (reviewsObj.reviews[i].id == review.id) {
                reviewsObj.reviews.splice(i, 1)
                console.log(`deleted ${reviewsObj.reviews[i]}`)
            } else {
                console.log(`passed by ${reviewsObj.reviews[i]} and did not delete it`)
            }
        }
        
        // recalculate the average rating and replace that value in realtime
        populateRatingCell(reviewsObj, ratingCell)

    })

    // append delete button to the review text
    review.appendChild(deleteBttn)

    // return review object
    return review
}

function calculateRating(e) {
    // total number of ratings as denominator
    let numberOfReviews = e.reviews.length

    // iterate over all reviews to find their sum (numerator)
    let ratingTally = 0
    for (let i = 0; i < numberOfReviews; i++) {
        ratingTally += e.reviews[i].rating
    }

    // calculate the average review
    let avgRating = ratingTally / numberOfReviews
    //round the result to 2 decimal places
    avgRating = (Math.floor(avgRating * 100)) /100

    // return the result
    return avgRating
}

function renderStars(rating) {
    // round the number of stars down to a whole number
    rating = Math.floor(rating)

    // render string containing avg rating as stars
    let ratingStars = ""

    // concatenates solid stars and then empty stars, always totaling 5
    for (let i=0; i<5; i++){
        if (i < rating){
            ratingStars += `★`;
        } else {
            ratingStars += `☆`;
        }
    }

    // return concatenated string
    return ratingStars
}

function addFormSubmitHandler() {
    // define form submit event functionality
    const form = document.getElementById('leave-review')
    form.addEventListener('submit', function(e) {

        // prevent default refresh behavior
        e.preventDefault()

        // store user inputs from form in variables
        const gameDropDown = document.getElementById('games-dropdown').value
        const gameID = gameDropDown.split('-')[1]
        const rating = document.querySelector('input[name="star-rating"]:checked').value;
        const comment = document.querySelector('textarea[name="comment"]').value;

        // assemble user input variables into object notation
        const newReview = {
            rating: +rating,
            comment: comment,
            gameId: +gameID,
        }

        // store user input object in local memory for optimistic rendering
        const reviewsObj = localData[gameID - 1]
        reviewsObj.reviews.push(newReview)
        
        // submit user input object to JSON database server
        // construct configutation object for POST fetch
        const configObj = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newReview)
        }

        // use fetch to POST information written in the form upon submitting
        fetch(BASE_URL+"/reviews", configObj)
            .then(res => res.json())
            .then(function(data){
            // optimistically render user's review submission
            const reviewDetails = document.querySelector(`#${gameDropDown} > td.review-cell > details`)
            const review = renderReview(data)
            reviewDetails.appendChild(review)})
        
            
        // optimistically update cell containing average rating of game
        const ratingCell = document.querySelector(`#gameID-${gameID} > td.rating-cell`)
        populateRatingCell(reviewsObj, ratingCell)
        })
}

const mkElement = (element) => document.createElement(element)


function renderReviewForm() {
    // create a form to leave reviews and define submit even functionality
    populateGameDropdown() 
    addFormSubmitHandler()
}

function init() {
    // initiates when program is loaded (defers until DOM is loaded via "defer" tag in index.html)
    renderReviewForm()
    displayGames()
}

// define base URL to access JSON database
const BASE_URL = "http://localhost:3000"

// define empty array to store local data points for optimistic rendering
let localData = []

// initiate the program
init()


