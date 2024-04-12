// Add listeners to the buttons
document.getElementsByClassName("healthSum")[0].addEventListener ("click", createHealthSumWindow);
document.getElementsByClassName("wannaWanga")[0].addEventListener ("click", createWannaWanga);

function createHealthSumWindow() {
    let panel = jsPanel.create({
        theme: 'dark',
        headerTitle: 'Socialized Healthcare',
        headerToolbar: '<span class="text-sm">Socialism is when your health gets equalized.</span>',
        panelSize: {
            width: () => { return Math.min(410, window.innerWidth*0.9);},
            height: () => { return Math.min(380, window.innerHeight*0.6);}
        },
        animateIn: 'jsPanelFadeIn',
        onwindowresize: true,
    });


    panel.content.innerHTML = "<iframe src = \"./toolpages/healthSum.html\" style=\" width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999; display: block;\"></iframe>"
}

function createWannaWanga() {
    let panel = jsPanel.create({
        theme: 'dark',
        headerTitle: 'De Wanna Wanga',
        headerToolbar: '<span class="text-sm">What did you say?</span>',
        panelSize: {
            width: () => { return Math.min(560, window.innerWidth*0.9);},
            height: () => { return Math.min(380, window.innerHeight*0.6);}
        },
        animateIn: 'jsPanelFadeIn',
        onwindowresize: true,
    });

    panel.content.innerHTML = "<iframe width=\"560\" height=\"315\" src=\"https:\/\/www.youtube.com/embed/CfTmQGmtJRM?si=OsEoBS7fq_P83vZb&autoplay=1\" title=\"YouTube video player\" frameborder=\"0\" allow=\"accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share\" referrerpolicy=\"strict-origin-when-cross-origin\" allowfullscreen></iframe>"
}