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

function addFormSubmitHandler() {
    const form = document.getElementById('leave-review')
    form.addEventListener('submit', function(event) {
        event.preventDefault()
        submitForm(event)
    })
}

function submitForm(event) {
    // 
}


function renderReviewForm() {
    populateGameDropdown() 
    addFormSubmitHandler()
}

function init() {
    renderReviewForm()
}

init()