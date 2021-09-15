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


function renderReviewForm() {
    populateGameDropdown() 
}

function init() {
    renderReviewForm()
}

init()