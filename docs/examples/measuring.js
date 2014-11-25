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
