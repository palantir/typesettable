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
        const rect = element.getBoundingClientRect();
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
    createUpdater("#svg6", {
        textRotation: -90,
        textShear: 0,
        xAlign: "right"
    }),
];

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

// bind shear slider
const slider = document.querySelector("input#shear");
function updateShear() {
    const value = parseInt(slider.value);
    updatables.forEach((u) => {
        if (u.options.textShear != null) {
            u.options.textShear = value;
            u.update.apply(u);
        }
    });
};
slider.addEventListener("change", updateShear);
updateShear();

const textSetters = document.querySelectorAll("input[data-text]");
textSetters.forEach((textSetter) => {
    textSetter.addEventListener("click", () => {
        textArea.value = textSetter.getAttribute("data-text");
        updateText();
    });
});
