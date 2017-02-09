const d3 = require("d3");
const SVGTypewriter = require("svg-typewriter");

function createUpdater(selector, options) {
    const element = document.querySelector(selector);
    const selection = d3.select(element);
    const writeOptions = Object.assign({}, {
        selection: selection,
        xAlign: "left",
        yAlign: "top",
        textRotation: 0
    }, options);

    const measurer = new SVGTypewriter.CacheMeasurer(selection);
    const wrapper = new SVGTypewriter.Wrapper();
    const writer = new SVGTypewriter.Writer(measurer, wrapper);

    const update = function() {
        const rect = writeOptions.rect == null ? element.getBoundingClientRect() : writeOptions.rect;
        selection.selectAll("*").remove()
        writer.write(this.text, rect.width, rect.height, this.options);
    };

    return {
        update,
        text: "",
        options: writeOptions,
    };
}

const updatables = [
    createUpdater("#svg1"),
    createUpdater("#svg2"),
    createUpdater("#svg3", {textRotation: 90}),
    createUpdater("#svg4", {textRotation: -90}),
    createUpdater("#svg5", {xAlign: "right"}),
];
const configurable = createUpdater("#shearPreview", {
    textRotation: -90,
    textShear: 0,
    xAlign: "right",
    rect: {
        width: 100,
        height: 100
    }
});
updatables.push(configurable);

// bind text area
const textArea = document.querySelector("textarea");
function updateText() {
    const text = textArea.value;
    updatables.forEach((u) => {
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
    configurable.options.textShear = value;
    configurable.update.apply(configurable);
};
slider.addEventListener("input", updateShear);
updateShear();

// bind angles
const rotationSetters = document.querySelectorAll("input[data-rotation]");
Array.prototype.forEach.call(rotationSetters, (button) => {
    button.addEventListener("click", () => {
        configurable.options.textRotation = parseInt(button.getAttribute("data-rotation"));
        configurable.update.apply(configurable);
    });
});

// bind x alignment
Array.prototype.forEach.call(document.querySelectorAll("input[data-x-alignment]"), (button) => {
    button.addEventListener("click", () => {
        configurable.options.xAlign = button.getAttribute("data-x-alignment");
        configurable.update.apply(configurable);
    });
});

// bind y alignment
Array.prototype.forEach.call(document.querySelectorAll("input[data-y-alignment]"), (button) => {
    button.addEventListener("click", () => {
        configurable.options.yAlign = button.getAttribute("data-y-alignment");
        configurable.update.apply(configurable);
    });
});
