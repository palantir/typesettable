measurer = new SVGTypewriter.Measurers.Measurer(svg);
writer = new SVGTypewriter.Writers.Writer(measurer);
writeOptions = {
  selection: svg,
  xAlign: "left",
  yAlign: "bottom",
  textRotation: 0,
  animator: new SVGTypewriter.Animators.UnveilAnimator().direction("left").duration(3000)
};
text = "Hello world!";
writer.write(text, 300, 300, writeOptions);