///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Converter Test Suite", () => {
  describe("Ident Converter", () => {
    it("single letter", () => {
      var s: string;
      var id = SVGTypewriter.Converters.ident();
      s = "a";
      assert.equal(s, id(s), "ident returns same single letter");
    });

    it("multiple letter", () => {
      var s: string;
      var id = SVGTypewriter.Converters.ident();
      s = "aaaa";
      assert.equal(s, id(s), "ident returns same multiple letter");
    });

    it("special character", () => {
      var s: string;
      var id = SVGTypewriter.Converters.ident();
      s = "<?#$";
      assert.equal(s, id(s), "ident returns same special characters");
    });

    it("multiple words", () => {
      var s: string;
      var id = SVGTypewriter.Converters.ident();
      s = "foo bar boo\n fun zoo.\n";
      assert.equal(s, id(s), "ident returns same multiple words");
    });
  });

  describe("Combine White Spaces Converter", () => {
    it("single letter", () => {
      var s: string;
      var converter = SVGTypewriter.Converters.combineWhitespace(SVGTypewriter.Converters.ident());
      s = "a";
      assert.equal(s, converter(s), "combine whitespaces returns same single letter");
    });

    it("single space", () => {
      var s: string;
      var converter = SVGTypewriter.Converters.combineWhitespace(SVGTypewriter.Converters.ident());
      s = "a ";
      assert.equal(s, converter(s), "combine whitespaces returns same single letter with sapce");
    });

    it("only space", () => {
      var s: string;
      var converter = SVGTypewriter.Converters.combineWhitespace(SVGTypewriter.Converters.ident());
      s = " ";
      assert.equal(s, converter(s), "combine whitespaces returns same single space");
    });

    it("multiple space", () => {
      var s: string;
      var converter = SVGTypewriter.Converters.combineWhitespace(SVGTypewriter.Converters.ident());
      s = "    ";
      assert.equal(" ", converter(s), "combine whitespaces returns single space");
    });

    it("multiple space between words", () => {
      var s: string;
      var converter = SVGTypewriter.Converters.combineWhitespace(SVGTypewriter.Converters.ident());
      s = "aa    aa";
      assert.equal("aa aa", converter(s), "combine whitespaces returns words with single space between");
    });

    it("multiple whitechars between words", () => {
      var s: string;
      var converter = SVGTypewriter.Converters.combineWhitespace(SVGTypewriter.Converters.ident());
      s = "aa    \taa";
      assert.equal("aa aa", converter(s), "combine whitespaces returns words with single space between");
    });
  });
});
