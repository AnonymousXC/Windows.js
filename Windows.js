
const Win = function(options) {
    this.options = options;
    this.id = this.options.id ? this.options.id : "".concat((Math.random() + 1).toString(36).substring(7))
    this.windowPos = {};
    let transition = this.options.transition ? `transition: ${this.options.transition}` : `transition : all 200ms`;

    const functions = {

        newWindow : async () => {
            let windowHtml = `
            <div class="Window-Main" id="Window-Main-${this.id}" data-is-maximized="0">
                <nav class="Window-Titlebar" id="Window-Titlebar-${this.id}">
                    <span class="Window-Title" id="Window-Title-${this.id}">Title</span>
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

        functions.styles();
        functions.dragWindow();
        functions.closeWindow();
        functions.maximizeWindow();
        functions.minimizeWindow();
        },

        styles : async () => {
            let css = `
                <style>
                    .Window-Main {
                        display: none;
                        position: absolute;
                        width: 600px;
                        height: 400px;
                        background-color: rgb(44, 44, 46);
                        border-radius: 10px;
                        ${transition};
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
                    }

                    .Window-Title {
                        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                        color: #fff;
                        position: relative;
                        left: 45%;
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
                        align-items: center;
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

                    .Window-Main::after {
                        content: '';
                        position: absolute
                    }
                </style>
            `
            await document.head.insertAdjacentHTML("beforeend", css)
        },

        closeWindow: async () => {
            let closeBtn = await document.getElementById("Window-Close-" +this.id)
            console.log(closeBtn);
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
                    mainDiv.style.left = "0";
                    mainDiv.style.top = "0";
                    mainDiv.style.width = "100%";
                    mainDiv.style.height = "100%";
                    maxBtn.innerHTML = "&#128471;&#xFE0E;"
                    state = "1";
                }
                else {
                    mainDiv.style.left = this.windowPos.x;
                    mainDiv.style.top = this.windowPos.y;
                    mainDiv.style.width = this.windowPos.width;
                    mainDiv.style.height = this.windowPos.height;
                    maxBtn.innerHTML = "&#128470;&#xFE0E;"
                    state = "0";
                }
                mainDiv.setAttribute("data-is-maximized", state);
        },

        minimizeWindow: async () => {
            let maxBtn = await document.getElementById("Window-Min-" + this.id);
            await maxBtn.addEventListener("click", (e) => {
                maxBtn.parentElement.parentElement.parentElement.style.scale = "0";
            })
        },

        dragWindow : async () => {
            let win = document.getElementById("Window-Main-" + this.id);
            let nav = document.getElementById("Window-Titlebar-" + this.id)
            let bodyRect = document.body.getBoundingClientRect();
            nav.ondragstart = (e) => { return false}
            nav.addEventListener("mousedown", draggingWin = function (event) {

                let dragging = false;
                let winRect = win.getBoundingClientRect();
                let posAddX = parseInt(event.pageX) - winRect.x;
                let posAddY = parseInt(event.pageY) - winRect.y;

                win.style.position = 'absolute';
                win.style.zIndex = 1000;
              
                function moveAt(pageX, pageY) {
                  win.style.left = functions.clampValue(parseInt(pageX) - posAddX , 0, bodyRect.width) + "px";
                  win.style.top = functions.clampValue(parseInt(pageY) - posAddY, 0, bodyRect.height) + "px";
                }

                function onMouseMove(event) {
                  win.style.transition = "none";
                  dragging = true;
                  if(dragging === true && event.clientY > 50 && parseInt(win.getAttribute("data-is-maximized")) === 1 ) {
                    functions.toggleMaximize(parseInt(event.pageX) + posAddX, parseInt(event.pageY) + posAddY);
                    isToggledMax = true
                  }
                  moveAt(event.pageX, event.pageY);
                }
              
                document.addEventListener('mousemove', onMouseMove);
              
                nav.onmouseup = function(event) {
                  win.style.transition = transition.replace(/transition : /, "");
                  document.removeEventListener('mousemove', onMouseMove);
                  nav.onmouseup = null;
                  if(dragging === true && event.clientY < 50) {
                    functions.toggleMaximize();
                  }
                };

                document.body.onmouseleave =  (e) => {
                    win.style.transition = transition.replace(/transition : /, "");
                    document.removeEventListener('mousemove', onMouseMove);
                    document.body.onmouseleave = null;
                  }
                
              
              });
        },

        clampValue : (val, min, max) => {
            return val > max ? max : val < min ? min : val;
        },

        show : () =>{
            let win = document.getElementById("Window-Main-" + this.id);
            win.style.display = "block";
        },

        hide : () => {
            let win = document.getElementById("Window-Main-" + this.id);
            win.style.display = "none";
        },

        unminimize : () => {
            let win = document.getElementById("Window-Main-" + this.id);
            win.style.scale = "1";
        }

    }
    
    this.add = functions.newWindow;
    this.show = functions.show;
    this.unminimize = functions.unminimize;
    this.addShow = () => {functions.newWindow(); functions.show();}
}