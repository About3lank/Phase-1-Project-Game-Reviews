function populateGameDropdown() {
    const menu = document.getElementById('games-dropdown')
    fetch(BASE_URL)
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

function addFormSubmitHandler() {
    const form = document.getElementById('leave-review')
    form.addEventListener('submit', function(event) {
        event.preventDefault()
        submitForm(event)
    })
}

function submitForm(event) {
    const gameDropDown = document.getElementById('games-dropdown')

    const gameID = gameDropDown.value.split('-')[1]
    const rating = document.querySelector('input[name="star-rating"]:checked').value;
    const comment = document.querySelector('textarea[name="comment"]').value;

    const newReview = {
        rating: rating,
        comment: comment,
        gameId: gameID
    }

    const configObj = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newReview)
    }

    fetch(REVIEWS_URL, configObj)
        .then(res => res.json())
        .then(data => console.log(data))
}


function renderReviewForm() {
    populateGameDropdown() 
    addFormSubmitHandler()
}

function init() {
    renderReviewForm()
}

REVIEWS_URL = "http://localhost:3000/reviews"

init()

