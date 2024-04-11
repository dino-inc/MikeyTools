document.getElementsByClassName("equalizeButton")[0].addEventListener("click", equalize);

function equalize(){
    let healthPool = document.getElementsByClassName("creature")
    let poolSum = 0;
    for (let i = 0; i < healthPool.length; i++) {
        poolSum += parseInt(healthPool[i].value);
    } 
    document.getElementsByClassName("healthSumOutput")[0].innerHTML = poolSum/healthPool.length
}