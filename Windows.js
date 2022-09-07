
const Win = function(options) {
    this.options = options;
    this.id = this.options.id ? this.options.id : "".concat((Math.random() + 1).toString(36).substring(7))
    this.windowPos = {};
    this.options.x = this.options.x ? this.options.x : 0
    this.options.y = this.options.y ? this.options.y : 0
    this.isMouseOnTitle = false;
    let isMaxWin = false;
    let transition = this.options.transition ? `transition: ${this.options.transition}` : `transition : all 200ms`;

    const functions = {

        newWindow : async () => {
            let windowHtml = `
            <div class="Window-Main" id="Window-Main-${this.id}" data-is-maximized="0" tabindex="0" style="transform:translate(${this.options.x}px, ${this.options.y}px)">
                <nav class="Window-Titlebar" id="Window-Titlebar-${this.id}">
                    <span class="Window-Title" id="Window-Title-${this.id}">${this.options.title ? this.options.title : "Title"}</span>
                    <div class="Window-Button-Wrapper">
                        <button id="Window-Min-${this.id}" class="Window-Buttons" onmousedown="">&#128469;&#xFE0E;</button>
                        <button id="Window-Max-${this.id}" class="Window-Buttons">&#128470;&#xFE0E;</button>
                        <button id="Window-Close-${this.id}" class="Window-Buttons">&#128473;&#xFE0E;</button>
                    </div>
                </nav>
                <div class="Window-Body" id="Window-Body-${this.id}">${this.options.content ? this.options.content : ""}</div>
            </div>
        `
        await document.body.insertAdjacentHTML("beforeend", windowHtml);

        let currWin = document.getElementById("Window-Main-" + this.id);
        currWin.style.left = this.options.x;
        currWin.style.top = this.options.y;
        currWin.style.width = this.options.width ? this.options.width : "600px";
        currWin.style.height = this.options.height ? this.options.height : "400px";

        functions.loadInteractJS("https://cdn.jsdelivr.net/npm/interactjs/dist/interact.min.js")
        functions.styles();
        functions.closeWindow();
        functions.maximizeWindow();
        functions.minimizeWindow();
        this.options.maximized ? functions.toggleMaximize() : "";
        this.options.draggable ? functions.dragWindow() : "";
        this.options.resizable ? functions.resizeWindow() : "";
        },

        styles : async () => {
            let css = `
                <style id="WindowJS-StyleSheet">
                    .Window-Main {
                        display: none;
                        z-index: 5;
                        position: absolute;
                        width: ${this.options.width};
                        height: ${this.options.height};
                        background-color: rgb(44, 44, 46);
                        border-radius: 10px;
                        overflow: hidden;
                        ${transition};
                        
                        min-width: 400px;
                        min-height: 400px;
                        box-sizing: border-box;
                    }

                    .Window-Titlebar {
                        position: relative;
                        background-color: rgb(28, 28, 30);
                        top: 0px;
                        height: 28px;
                        display: flex;
                        border-top-left-radius: 10px;
                        border-top-right-radius: 10px;
                        border-bottom: solid 1px rgb(155, 160, 170);
                        justify-content: space-between;
                        align-items: center;
                        cursor: initial !important;
                    }

                    .Window-Title {
                        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                        color: #fff;
                        position: relative;
                        width: 100%;
                        text-align: center;
                        left: 0;
                        transform: translateX(25px);
                        user-select: none !important;
                    }

                    .Window-Button-Wrapper {
                        margin-right: 6px;
                        display: flex;
                        gap: 6px;
                    }

                    .Window-Buttons {
                        border-radius: 50%;
                        width: 18px;
                        height: 18px;
                        border: none;
                        display: flex;
                        justify-content: center;
                        line-height: 1.2;
                        color: transparent;
                        z-index: 100;
                    }

                    .Window-Buttons:nth-child(3) {
                        background-color: rgb(255, 69, 58);
                    }

                    .Window-Buttons:nth-child(2) {
                        background-color: #feb429;
                    }

                    .Window-Buttons:nth-child(1) {
                        background-color: #24c138;
                    }

                    .Window-Buttons:hover {
                        color: black;
                    }

                    .Window-Body {
                        height: 100%;
                        width: 100%;
                        overflow: auto;
                    }

                    .Window-Body::-webkit-scrollbar {
                        width: 6px;
                        background: transparent;
                    }

                    .Window-Body {
                        scrollbar-color: rgb(210,210,210, 0.5) rgba(46,54,69,0) !important;
                        scrollbar-width: thin !important;
                    }
                    
                    .Window-Body::-webkit-scrollbar-track {
                        border-radius: 15px;
                    }
                    
                    .Window-Body::-webkit-scrollbar-thumb {
                        border-radius: 15px; 
                        background: rgba(255,255,255,0.5);
                    }

                    .Window-Body::-webkit-scrollbar-thumb:hover {
                        background: rgba(255,255,255,0.6);
                    }

                    .Window-Main:focus {
                        z-index: 10;
                    }

                    @media (-moz-touch-enabled: 1), (pointer:coarse), (hover: none) {
                        .Window-Main {
                            width: 100vw;
                            height: 100vh;
                        }
                    }

                </style>
            `
            let styleSheet = document.getElementById("WindowJS-StyleSheet")
            if(!styleSheet) 
                await document.head.insertAdjacentHTML("beforeend", css)
        },

        closeWindow: async () => {
            let closeBtn = await document.getElementById("Window-Close-" +this.id)
            await closeBtn.addEventListener("click", (e) => {
                e.target.parentElement.parentElement.parentElement.style.display = "none"
            });
        },

        maximizeWindow: async () => {
            let maxBtn = await document.getElementById("Window-Max-" + this.id);
            await maxBtn.addEventListener("click", (e) => {
                e.stopImmediatePropagation();
                functions.toggleMaximize();
            })
        },

        toggleMaximize : async (optionalX, optionalY) => {
            this.windowPos.x = optionalX ? optionalX : this.windowPos.x;
            this.windowPos.y = optionalY ? optionalY : this.windowPos.y;
            let maxBtn = await document.getElementById("Window-Max-" + this.id);
            let mainDiv = maxBtn.parentElement.parentElement.parentElement;
                let isMax = parseInt(mainDiv.getAttribute("data-is-maximized"));
                let state = "0";
                if(isMax === 0) {
                    this.windowPos.x = mainDiv.style.left;
                    this.windowPos.y = mainDiv.style.top;
                    this.windowPos.width = mainDiv.style.width;
                    this.windowPos.height = mainDiv.style.height;
                    mainDiv.style.transform = `translate(0px, ${window.pageYOffset}px)`
                    mainDiv.style.width = "100%";
                    mainDiv.style.height = "100%";
                    maxBtn.innerHTML = "&#128471;&#xFE0E;"
                    state = "1";
                    isMaxWin = true;
                }
                else {
                    mainDiv.style.transform = `translate(${this.windowPos.x}px, ${this.windowPos.y}px)`
                    mainDiv.style.width = this.windowPos.width;
                    mainDiv.style.height = this.windowPos.height;
                    maxBtn.innerHTML = "&#128470;&#xFE0E;"
                    state = "0";
                    isMaxWin = false
                }
                mainDiv.setAttribute("data-is-maximized", state);
        },

        minimizeWindow: async () => {
            let maxBtn = await document.getElementById("Window-Min-" + this.id);
            await maxBtn.addEventListener("click", (e) => {
                maxBtn.parentElement.parentElement.parentElement.style.scale = "0";
                setTimeout(() => {
                    maxBtn.parentElement.parentElement.parentElement.style.display = "none"
                }, 1000)
            })
        },

        clampValue : (val, min, max) => {
            return val > max ? max : val < min ? min : val;
        },

        show : () =>{
            let win = document.getElementById("Window-Main-" + this.id);
            win.style.display = "block";
            win.style.scale = "1";
        },

        hide : () => {
            let win = document.getElementById("Window-Main-" + this.id);
            win.style.display = "none";
        },

        unminimize : () => {
            let win = document.getElementById("Window-Main-" + this.id);
            win.style.display = "block"
            win.style.scale = "1";
        },

        dragWindow : () => {
            const position = { x: this.options.x, y: this.options.y }
                interact(`#Window-Titlebar-${this.id}`).draggable({
                inertia: {
                    resistance: 10,
                    minSpeed: 100,
                    endSpeed: 100
                  },
                listeners: {
                    start(event) {
                        event.target.parentElement.style.transition = "none";
                        },
                    move (event) {
                        position.x += event.dx
                        position.y += event.dy
                        if(event.client.y >= 50 && isMaxWin === true)
                            functions.toggleMaximize()
                        event.target.parentElement.style.transform =`translate(${position.x}px, ${position.y}px)`
                        },
                    end(event) {
                        event.target.parentElement.style.transition = transition.replace("transition : ", "");
                        if(event.clientY < 50 && isMaxWin === false)
                            functions.toggleMaximize()
                        },
                    }
                })

        },

        resizeWindow : () => {

            interact(`#Window-Main-${this.id}`).resizable({
                edges: { top: false, left: false, bottom: true, right: true },
                listeners: {
                    move: function (event) {
                        event.target.style.transition = "none"
                        let { x, y } = event.target.dataset

                        x = (parseFloat(x) || 0) + event.deltaRect.left
                        y = (parseFloat(y) || 0) + event.deltaRect.top
                        
                        Object.assign(event.target.style, {
                        width: `${event.rect.width}px`,
                        height: `${event.rect.height}px`,
                        // transform: `translate(${x}px, ${y}px)`
                        })

                        Object.assign(event.target.dataset, { x, y })
                        },
                    end : (event) => {
                        event.target.style.transition = transition.replace("transition :", "")
                    }
                }

            })

        },

        loadInteractJS : ( url ) => {
            var ajax = new XMLHttpRequest();
            ajax.open( 'GET', url, false ); // <-- the 'false' makes it synchronous
            ajax.onreadystatechange = function () {
                var script = ajax.response || ajax.responseText;
                if (ajax.readyState === 4) {
                    switch( ajax.status) {
                        case 200:
                            eval.apply( window, [script] );
                            break;
                        default:
                    }
                }
            };
            ajax.send(null);
        }
    
    }
    
    this.add = functions.newWindow;
    this.show = functions.show;
    this.unminimize = functions.unminimize;
    this.getID = "Window-Main-" + this.id
    this.addShow = () => {functions.newWindow(); functions.show();}
}