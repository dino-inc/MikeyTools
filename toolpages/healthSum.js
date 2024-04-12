// Add the event listeners to the buttons
document.getElementsByClassName("average")[0].addEventListener("click", equalize);
document.getElementsByClassName("clear")[0].addEventListener("click", clear);

function equalize(){
    let healthPool = document.getElementsByClassName("creature")
    let poolSum = 0;
    let totalCount = 0;
    for (let i = 0; i < healthPool.length; i++) {
        console.log(parseInt(healthPool[i].value))
        if(healthPool[i].value.length == 0) {
            continue;
        } else {
            poolSum += parseInt(healthPool[i].value);
            totalCount += 1;
        }
    } 
    document.getElementsByClassName("healthSumOutputValue")[0].innerHTML = poolSum/totalCount;
}

function clear (){
    let inputs = document.getElementsByClassName("creature")
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
    document.getElementsByClassName("healthSumOutputValue")[0].innerHTML = "N/A"

}