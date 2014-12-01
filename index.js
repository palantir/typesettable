function measuring(div) {
  svg = div.select(".area");
  result = div.select(".result");
  svg.attr("width", 300).attr("height", 300);
  measurer = new SVGTypewriter.Measurers.Measurer(svg);
  writer = new SVGTypewriter.Writers.Writer(measurer);
  writeOptions = {
      selection: svg,
      xAlign: "center",
      yAlign: "center",
      textRotation: 0
    };
  text = "Hello world!";
  writer.write(text, 300, 300, writeOptions);
  dimensions = measurer.measure(text);
  result.text("Text occupies: width - " + dimensions.width.toFixed(2) + "px, height - " + dimensions.height.toFixed(2) + "px");
}

function wrapping(div) {
  svg = div.select(".area");
  result = div.select(".result");
  svg.attr("width", 250).attr("height", 250);
  wrapper = new SVGTypewriter.Wrappers.Wrapper();
  measurer = new SVGTypewriter.Measurers.Measurer(svg);
  writer = new SVGTypewriter.Writers.Writer(measurer, wrapper);
    writeOptions = {
      selection: svg,
      xAlign: "left",
      yAlign: "top",
      textRotation: 0
    };
  text = "Hello world!";
  $(".width-option").click(function() {
    svg.selectAll("*").remove();
    writer.write(text, parseInt(this.value.substring(0,2)), 250, writeOptions);
  });
}

function animation(div, animator) {
  var svg = div.select(".area");
  var result = div.select(".result");
  svg.attr("width", 300).attr("height", 300);
  var measurer = new SVGTypewriter.Measurers.Measurer(svg);
  var writer = new SVGTypewriter.Writers.Writer(measurer);
  var writeOptions = {
      selection: svg,
      xAlign: "left",
      yAlign: "bottom",
      textRotation: 0,
      animator: animator
    };
  text = "Hello world!";
  var animate = function () {
    svg.selectAll("*").remove();
    writer.write(text, 300, 300, writeOptions);
  }
  div.select(".re-run").on("click", animate);
  animate();
}

window.onload = function() {
  measuring(d3.select("#simple-measurer"));
  measuring(d3.select("#font-measurer"));
  wrapping(d3.select("#simple-wrapping"));
  animation(d3.select("#simple-writing"), new SVGTypewriter.Animators.UnveilAnimator().direction("left").duration(3000));
}