wrapper = new SVGTypewriter.Wrappers.Wrapper();
measurer = new SVGTypewriter.Measurers.Measurer(svg);
text = "Hello world!";
wrapping_result = wrapper.wrap(text, measurer, 25, 250);
// wrapping_result = {
//   originalText: "Hello world!",
//   wrappedText: "He-↵llo↵wo-↵rld!",
//   noLines: 4,
//   noBrokeWords: 2,
//   truncatedText: ""
// }
