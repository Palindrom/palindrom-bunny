// palindrom-bunny v4.0.0 | MIT License
const jumps = 10;

const stageAnimation = Array(jumps).fill(true).map((_, i) => {
    let jumpStart;
    let jumpEnd;

    if (i < jumps/2) {
        jumpStart = `translateX(${2*100*i/jumps}%)`;
        jumpEnd = `translateX(${2*100*(i+1)/jumps}%)`;
    }
    else {
        const j = i - jumps/2;
        jumpStart = `translateX(-${2*100*(j/jumps)}%) rotateY(180deg)`;
        jumpEnd = `translateX(-${2*100*((j+1)/jumps)}%) rotateY(180deg)`;
    }

    let css = `
        ${(0 + 100*i + 0.01*i)/jumps}%   { transform: translateZ(0) ${jumpStart}; }
        ${(10 + 100*i)/jumps}%  { transform: translateZ(0) ${jumpStart}; }
        ${(50 + 100*i)/jumps}%  { transform: translateZ(0) ${jumpEnd}; }
        ${(100 + 100*i)/jumps}% { transform: translateZ(0) ${jumpEnd}; }
        `;
        return css;
}).join("\n");

let tmpl = document.createElement('template');
tmpl.innerHTML = /*html*/`
    <style>
        #stage {
            width: 100%;
            animation: stage 20s;
            animation-timing-function: cubic-bezier(0.280, 0.840, 0.420, 1);
            animation-iteration-count: infinite;
        }

        @keyframes stage {
            ${stageAnimation}
        }

        #bunny {
            display: inline-block;
            animation: bunny 2s;
            animation-timing-function: cubic-bezier(0.280, 0.840, 0.420, 1);
            animation-iteration-count: infinite;
            transform-origin: center left;
        }

        @keyframes bunny {
            0%   { transform: translateZ(0) scale(1,1)      translateY(0)      ; }
            10%  { transform: translateZ(0) scale(1.1,.9)   translateY(0)      ; }
            30%  { transform: translateZ(0) scale(.9,1.1)   translateY(-100px) ; }
            50%  { transform: translateZ(0) scale(1.05,.95) translateY(0)      ; }
            57%  { transform: translateZ(0) scale(1,1)      translateY(-7px)   ; }
            64%  { transform: translateZ(0) scale(1,1)      translateY(0)      ; }
            100% { transform: translateZ(0) scale(1,1)      translateY(0)      ; }
        }
    </style>
    <div id="stage">
        <div id="rotate">
            <div id="bunny">
                <slot></slot>
            </div>
        </div>
    </div>`;

    let usedShadyCss  = false;

    if (window.ShadyCSS) {
        usedShadyCss = true;
        ShadyCSS.prepareTemplate(tmpl, 'palindrom-bunny');
    }

    class PalindromBunnyElement extends HTMLElement {
        constructor(self) {
            self = super(self);
            if (usedShadyCss) {
                ShadyCSS.styleElement(self);
            }
            const shadowRoot = self.attachShadow({ mode: 'open' });
            const clone = document.importNode(tmpl.content, true);
            shadowRoot.appendChild(clone);
            return self;
        }
    }

    window.customElements.define('palindrom-bunny', PalindromBunnyElement);