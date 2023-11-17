document.querySelector('#search-form').addEventListener('submit', showMessage);

function showMessage() {
    const inputValue = document.querySelector("#search-input").value;

    if (!inputValue) {
        alert("Enter artist's name.")
    }
}