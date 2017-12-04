const { Typesetter } = require("typesettable");

const BOX_WIDTH = 100;
const BOX_HEIGHT = 100;

function createSvgUpdater(selector, options) {
    const element = document.querySelector(selector);
    const typesetter = Typesetter.svg(element);
    const writeOptions = Object(options);

    const update = function() {
        typesetter.wrapper.allowBreakingWords(this.options.wordBreak);
        element.innerHTML = "";
        typesetter.write(this.text, BOX_WIDTH, BOX_HEIGHT, this.options);
    };

    return {
        update,
        text: "",
        options: writeOptions,
    };
}

function retinaFix(ctx) {
    const { canvas } = ctx;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    canvas.style.width = rect.width + "px";
    canvas.style.height = rect.height + "px";
    ctx.scale(2, 2);
    return ctx;
}

function createCanvasUpdater(selector, options) {
    const element = document.querySelector(selector);
    const ctx = retinaFix(element.getContext("2d"));
    const fontStack = "sans-serif";
    const typesetter = Typesetter.canvas(ctx, 16, {
        font: "16px " + fontStack,
        fill: "dodgerblue",
    });
    const writeOptions = Object(options);

    const update = function() {
        typesetter.wrapper.allowBreakingWords(this.options.wordBreak);
        const rect = writeOptions.rect == null ? element.getBoundingClientRect() : writeOptions.rect;
        ctx.save();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, element.width, element.height);
        ctx.translate(150, 50);
        ctx.rect(0, 0, BOX_WIDTH, BOX_HEIGHT);
        ctx.strokeStyle = "lime";
        ctx.stroke();
        typesetter.write(this.text, BOX_WIDTH, BOX_HEIGHT, this.options);
        ctx.restore();
    };

    return {
        update,
        text: "",
        options: writeOptions,
    };
}

function createHtmlUpdater(selector, options) {
    const element = document.querySelector(selector);
    const typesetter = Typesetter.html(element);
    const writeOptions = Object(options);

    const update = function() {
        typesetter.wrapper.allowBreakingWords(this.options.wordBreak);
        element.innerHTML = "";
        typesetter.write(this.text, BOX_WIDTH, BOX_HEIGHT, this.options);
    };

    return {
        update,
        text: "",
        options: writeOptions,
    };
}

const configurables = [
    createSvgUpdater("#svgOutput"),
    createCanvasUpdater("#canvasOutput"),
    createHtmlUpdater("#htmlOutput"),
];

// bind text area
const textArea = document.querySelector("textarea");
function updateText() {
    const text = textArea.value;
    configurables.forEach((u) => {
        u.text = text;
        u.update.apply(u);
    });
};
textArea.addEventListener("change", updateText);
textArea.addEventListener("keyup", updateText);
updateText();

// bind text setters
const textSetters = document.querySelectorAll("input[data-text]");
Array.prototype.forEach.call(textSetters, (textSetter) => {
    textSetter.addEventListener("click", () => {
        textArea.value = textSetter.getAttribute("data-text");
        updateText();
    });
});

// bind shear slider
const slider = document.querySelector("input#shear");
function updateShear() {
    const value = parseInt(slider.value);
    configurables.forEach((configurable) => {
        configurable.options.textShear = value;
        configurable.update.apply(configurable);
    });
};
slider.addEventListener("input", updateShear);
updateShear();

// bind angles
const rotationSetters = document.querySelectorAll("input[data-rotation]");
Array.prototype.forEach.call(rotationSetters, (button) => {
    button.addEventListener("click", () => {
        configurables.forEach((configurable) => {
            configurable.options.textRotation = parseInt(button.getAttribute("data-rotation"));
            configurable.update.apply(configurable);
    });
    });
});

// bind x alignment
Array.prototype.forEach.call(document.querySelectorAll("input[data-x-alignment]"), (button) => {
    button.addEventListener("click", () => {
        configurables.forEach((configurable) => {
            configurable.options.xAlign = button.getAttribute("data-x-alignment");
            configurable.update.apply(configurable);
    });
    });
});

// bind y alignment
Array.prototype.forEach.call(document.querySelectorAll("input[data-y-alignment]"), (button) => {
    button.addEventListener("click", () => {
        configurables.forEach((configurable) => {
            configurable.options.yAlign = button.getAttribute("data-y-alignment");
            configurable.update.apply(configurable);
    });
    });
});

// bind word break
Array.prototype.forEach.call(document.querySelectorAll("input[data-word-break]"), (button) => {
    button.addEventListener("click", () => {
        configurables.forEach((configurable) => {
            configurable.options.wordBreak = button.getAttribute("data-word-break") === "true";
            console.log(configurable.options.wordBreak);
            configurable.update.apply(configurable);
    });
    });
});
