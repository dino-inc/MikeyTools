import * as jsPanel from "/jspanel/dist/jspanel.js"

function createListeners(){
    console.log("executing")
    document.getElementByClass("healthSum").addEventListener ("click", createHealthSumWindow);
}

function createHealthSumWindow() {
    console.log("Opening healthsum window")
    jsPanel.create({
        theme: 'dark',
        headerTitle: 'Socialized Healthcare',
        headerToolbar: '<span class="text-sm">Socialism is when your health gets averaged.</span>',
        panelSize: {
            width: () => { return Math.min(800, window.innerWidth*0.9);},
            height: () => { return Math.min(500, window.innerHeight*0.6);}
        },
        animateIn: 'jsPanelFadeIn',
        contentAjax: {
            url: './toolpages/healthsum.html',
            done: (xhr, panel) => {
                panel.content.innerHTML = xhr.responseText;
                Prism.highlightAll();
            }
        },
        onwindowresize: true,
    });
}