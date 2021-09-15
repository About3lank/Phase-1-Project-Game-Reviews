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