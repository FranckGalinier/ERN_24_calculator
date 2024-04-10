//fonction pour ajouter un élément à l'écran
function appendToDisplay(value) {
    document.getElementById('display').value += value;
}

//fonction pour effacer l'écran
function clearDisplay() {
    document.getElementById('display').value = '';
}

//méthode qui permet d'afficher la fonction de calcul
function appendFunction(func) {
    switch (func) {
        //case racine carrée
        case "sqrt":
            document.getElementById('display').value += '√(';
            break;
        //case exponentielle
        case "exp":
            document.getElementById('display').value += '^';
            break;
        //case modulo
        case "mod":
            document.getElementById('display').value += '%';
            break;
        //case cosinus
        case "cos":
            document.getElementById('display').value += 'cos(';
            break;
        //case sinus
        case "sin":
            document.getElementById('display').value += 'sin(';
            break;
        //case tangente
        case "tan":
            document.getElementById('display').value += 'tan(';
            break;
        //case pi
        case "pi":
            document.getElementById('display').value += 'π';
            break;
    }
}


function eraseLastCaracter() {
    let display = document.getElementById('display').value;
    document.getElementById('display').value = display.substring(0, display.length - 1);    //enlève le dernier caractère
}

//fonction pour calculer
function calculate() {
    //si une parenthèse est ouverte mais pas fermée, on la ferme
    let expression = document.getElementById('display').value;
    //on regarde dans expression le nombre de parenthèses ouvertes
    let openParenthesis = (expression.match(/\(/g) || []).length;
    //on regarde dans expression le nombre de parenthèses fermées
    let closeParenthesis = (expression.match(/\)/g) || []).length;
    //on fait la différence entre les 2
    let diff = openParenthesis - closeParenthesis;

    if (diff > 0) {
        for (let i = 0; i < diff; i++) {
            expression += ')';
        }
    }
    //si on a √ on remplace par Math.sqrt
    expression = expression.replace(/√/g, 'Math.sqrt');

    //si on a sin on remplace par Math.sin
    expression = expression.replace(/sin/g, 'Math.sin');
    //si on a cos on remplace par Math.cos
    expression = expression.replace(/cos/g, 'Math.cos');
    //si on a tan on remplace par Math.tan
    expression = expression.replace(/tan/g, 'Math.tan');
    //si on a ^ on remplace par **
    expression = expression.replace(/\^/g, '**');
    //si on a pi on remplace par Math.PI
    expression = expression.replace(/π/g, 'Math.PI');


    //on raite les exceptions
    //si on a un ) suivi d'une ( on remplace par )*(
    expression = expression.replace(/\)\(/g, ')*(');
    //si on n'a pas d'opérateur entre un nombre et une fonction, on ajoute un *
    expression = expression.replace(/(\d+)(?![)\-+*/%.']|\d)\b/g, "$1*");
    //si on n'a pas d'opérateur devant un ( on ajotue un *
    expression = expression.replace(/(\d+)\(/g, "$1*(");
    //si on a un nombre suivis de Math. on ajoute un *
    expression = expression.replace(/(\d+)(Math)/g, "$1*$2");
    //so l'expression termine par un * on l'enlève
    expression = expression.replace(/\*$/, '');

    //on affiche le résultat
    try {
        let result = eval(expression);
        document.getElementById('display').value = result;
        //on va stocker l'historique des calculs dans le local storage
        let history = JSON.parse(localStorage.getItem('history')) || [];
        history.push({ calcul: expression, resultat: result });
        localStorage.setItem('history', JSON.stringify(history));
        displayHistory();

    } catch (error) {
        document.getElementById('display').value = 'Error';
    }



}

//fonction pour afficher l'historique de scalculs
function displayHistory() {
    //on récupère l'élément tbody du tableau
    let tableHistory = document.getElementById('tableResult');
    //on vide le tableau
    tableHistory.innerHTML = "";
    let history = JSON.parse(localStorage.getItem('history')) || [];
    //on récupère les deix dernoer résultat de l'historique
    history = history.slice(-10);
    //on va boucler sur notre tableau l'historique
    history.forEach(element => {
        //si l'élément n'est pas nul, on crée une ligne sinon affiche un message "pas d'historique"
        if (element != null) {

            let tr = document.createElement('tr');
            let tdCalcul = document.createElement('td');
            tdCalcul.colSpan = 2;
            tdCalcul.textContent = element.calcul;

            let tdResultat = document.createElement('td');
            tdResultat.colSpan = 2;
            tdResultat.textContent = element.resultat;

            let tdDelete = document.createElement('td')
            tdDelete.colSpan = 2;
            tdDelete.innerHTML = `&#128465`;
            tdDelete.style.color = 'black';
            tdDelete.style.fontSize = '20px';
            tdDelete.style.cursor = 'pointer';
            
            //Add event listerner pour supprimer un élément de l'historique

            tdDelete.addEventListener('click', function(){
                deleteStorage(element)
                displayHistory();
            });


            //on ajoute les td dans le tr
            tr.append(tdCalcul, tdResultat, tdDelete);
            // on ajoute le tr dans le tbody
            tableHistory.appendChild(tr);
        } else {
            let td = document.createElement('td');
            let tr = document.createElement('tr');
            tr.colSpan = 4;
            tr.textContent = "Pas d'historique"
            td.appendChild(tr);
            tableHistory.appendChild(td);

        }
    });
}

function deleteStorage(element){
    let history = JSON.parse(localStorage.getItem('history')) || [];
    let index = history.findIndex(el =>el.calcul == element.calcul && el.resultat == element.resultat);
    history.splice(index, 1);
    localStorage.setItem('history',JSON.stringify(history));
}





displayHistory();
