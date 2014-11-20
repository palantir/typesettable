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

function writeAligns(div) {
  xAligns = ["left", "center", "right"];
  yAligns = ["top", "center", "bottom"];
  svg = div.select(".area");
  result = div.select(".result");
  svg.attr("width", 250).attr("height", 250);
  measurer = new SVGTypewriter.Measurers.Measurer(svg);
  writer = new SVGTypewriter.Writers.Writer(measurer);
  writeOptions = {
      selection: svg,
      xAlign: "center",
      yAlign: "center",
      textRotation: 0
    };
  text = "Hello world!";
  for (var i = 0; i < 3; ++i) {
    for (var j = 0; j < 3; ++j) {
      writeOptions.xAlign = xAligns[i];
      writeOptions.yAlign = yAligns[j];
      writer.write(text, 250, 250, writeOptions);
    }
  }
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

function writeRotations(div) {
  rotations = [0, -90, 90, 180];
  svg = div.select(".area");
  result = div.select(".result");
  svg.attr("width", 250).attr("height", 250);
  measurer = new SVGTypewriter.Measurers.Measurer(svg);
  writer = new SVGTypewriter.Writers.Writer(measurer);
  writeOptions = {
      selection: svg,
      xAlign: "center",
      yAlign: "top",
      textRotation: 0
    };
  text = "Hello world!";
  for (var i = 0; i < 4; ++i) {
    writeOptions.textRotation = rotations[i];
    writer.write(text, 250, 250, writeOptions);
  }
}

function animation(div, animator) {
  var svg = div.select(".area");
  var result = div.select(".result");
  svg.attr("width", 300).attr("height", 300);
  var measurer = new SVGTypewriter.Measurers.Measurer(svg);
  var writer = new SVGTypewriter.Writers.Writer(measurer);
  var writeOptions = {
      selection: svg,
      xAlign: "center",
      yAlign: "center",
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
  writeAligns(d3.select("#different-aligns"));
  writeRotations(d3.select("#different-rotations"));
  wrapping(d3.select("#simple-wrapping"));
  animation(d3.select("#opacity-animation"), new SVGTypewriter.Animators.OpacityAnimator().duration(3000).moveY(100));
  animation(d3.select("#unveil-animation"), new SVGTypewriter.Animators.UnveilAnimator().direction("left").duration(3000));
}