
// fonction pour ajouter un élément à l'écran
function appendToDisplay(value) {
    document.getElementById('display').value += value //concaténation quand on appuie sur les touches

}

//fonction pour effacer l'écran
function clearDisplay() {
    document.getElementById('display').value = '';
}

// fonction pour calculer

function calculate() {
    // dans une variable on va stocker  la valeur de l'input
    let expression = document.getElementById('display').value;
    console.log(expression);
    let result = eval(expression);
    console.log(result);
    document.getElementById('display').value = result;

}