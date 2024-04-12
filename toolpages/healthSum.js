// Add the event listeners to the buttons
document.getElementsByClassName("average")[0].addEventListener("click", equalize);
document.getElementsByClassName("clear")[0].addEventListener("click", clear);

function equalize(){
    let creaturePool = document.getElementsByClassName("creature")
    let numeratorSum = 0;
    let denominatorSum = 0;
    for (let i = 0; i < creaturePool.length; i++) {
        let numerator = creaturePool[i].children[1];
        let denominator = creaturePool[i].children[2];
        console.log(numerator)
        console.log(denominator)
        if (numerator.value.length == 0 || denominator.value.length == 0) {
            continue;
        } else {
            numeratorSum += parseInt(numerator.value);
            denominatorSum += parseInt(denominator.value);
        }
    } 
    let finalRatio = numeratorSum/denominatorSum
    for (let i = 0; i < creaturePool.length; i++) {
        let numerator = creaturePool[i].children[1];
        let denominator = creaturePool[i].children[2];
        if (numerator.value.length == 0 || denominator.value.length == 0) {
            continue;
        } else {
            numerator.value = Math.round(finalRatio * denominator.value);
        }
    } 
}

function clear (){
    let inputs = document.getElementsByClassName("creature")
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }

}