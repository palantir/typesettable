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

    return function(text) {
        const rect = element.getBoundingClientRect();
        selection.selectAll("*").remove()
        writer.write(text, rect.width, rect.height, writeOptions);
    }
}

const updatables = [
    createUpdater("#svg1"),
    createUpdater("#svg2"),
    createUpdater("#svg3", {textRotation: 90}),
    createUpdater("#svg4", {textRotation: -90}),
    createUpdater("#svg5", {xAlign: "right"}),
];

const textArea = document.querySelector("textarea");

function update() {
    const text = textArea.value;
    updatables.forEach(function (updatable) {
        updatable(text);
    });
};

textArea.addEventListener("change", update);
textArea.addEventListener("keyup", update);
update();