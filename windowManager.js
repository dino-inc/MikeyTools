// Add listeners to the buttons
document.getElementsByClassName("healthSum")[0].addEventListener ("click", createHealthSumWindow);

function createHealthSumWindow() {
    let panel = jsPanel.create({
        theme: 'dark',
        headerTitle: 'Socialized Healthcare',
        headerToolbar: '<span class="text-sm">Socialism is when your health gets averaged.</span>',
        panelSize: {
            width: () => { return Math.min(800, window.innerWidth*0.9);},
            height: () => { return Math.min(500, window.innerHeight*0.6);}
        },
        animateIn: 'jsPanelFadeIn',
        onwindowresize: true,
    });
    panel.content.innerHTML = "<iframe src = \"/toolpages/healthSum.html\" style=\" width:100%; height:99%; border:none; margin:0; padding:0; overflow:hidden; z-index:999999;\"></iframe>"
}