function renderGameRow(e) {
    const gameTable = document.getElementById('game-table')

    const gameRow = mkElement('tr')
    gameRow.id = `gameID-${e.id}`


    const reviewDetails = mkElement('details')
    const commentTitle = mkElement('summary')
    commentTitle.innerText = "Reviews"
    reviewDetails.appendChild(commentTitle)

    e.reviews.forEach(function(r) {
        const review = mkElement('p')
        review.innerText = 
        review.innerText += `${renderStars(r.rating)} ${r.comment}`
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

    nameCell.innerText = e.name
    releaseCell.innerText = e.release
    genreCell.innerText = e.genre
    const ratingValue = calculateRating(e)
    ratingCell.innerText = `${renderStars(ratingValue)} (${ratingValue})`
    reviewCell.append(reviewDetails)


    gameRow.append(thumbnailCell, nameCell, releaseCell, genreCell, ratingCell, reviewCell)
    gameTable.appendChild(gameRow)
}