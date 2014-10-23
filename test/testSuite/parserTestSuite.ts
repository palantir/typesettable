///<reference path="../testReference.ts" />

var assert = chai.assert;

describe("Parser Test Suite", () => {
  describe("Ident Parser", () => {
    it("single letter", () => {
      var s: string;
      var id = SVGTypewriter.Parsers.ident();
      s = "a";
      assert.equal(s, id(s), "ident returns same single letter");
    });

    it("multiple letter", () => {
      var s: string;
      var id = SVGTypewriter.Parsers.ident();
      s = "aaaa";
      assert.equal(s, id(s), "ident returns same multiple letter");
    });

    it("special character", () => {
      var s: string;
      var id = SVGTypewriter.Parsers.ident();
      s = "<?#$";
      assert.equal(s, id(s), "ident returns same special characters");
    });

    it("multiple words", () => {
      var s: string;
      var id = SVGTypewriter.Parsers.ident();
      s = "foo bar boo\n fun zoo.\n";
      assert.equal(s, id(s), "ident returns same multiple words");
    });
  });

  describe("Combine White Spaces Parser", () => {
    it("single letter", () => {
      var s: string;
      var parser = SVGTypewriter.Parsers.combineWhitespace(SVGTypewriter.Parsers.ident());
      s = "a";
      assert.equal(s, parser(s), "combine whitespaces returns same single letter");
    });

    it("single space", () => {
      var s: string;
      var parser = SVGTypewriter.Parsers.combineWhitespace(SVGTypewriter.Parsers.ident());
      s = "a ";
      assert.equal(s, parser(s), "combine whitespaces returns same single letter with sapce");
    });

    it("only space", () => {
      var s: string;
      var parser = SVGTypewriter.Parsers.combineWhitespace(SVGTypewriter.Parsers.ident());
      s = " ";
      assert.equal(s, parser(s), "combine whitespaces returns same single space");
    });

    it("multiple space", () => {
      var s: string;
      var parser = SVGTypewriter.Parsers.combineWhitespace(SVGTypewriter.Parsers.ident());
      s = "    ";
      assert.equal(" ", parser(s), "combine whitespaces returns single space");
    });

    it("multiple space between words", () => {
      var s: string;
      var parser = SVGTypewriter.Parsers.combineWhitespace(SVGTypewriter.Parsers.ident());
      s = "aa    aa";
      assert.equal("aa aa", parser(s), "combine whitespaces returns words with single space between");
    });

    it("multiple whitechars between words", () => {
      var s: string;
      var parser = SVGTypewriter.Parsers.combineWhitespace(SVGTypewriter.Parsers.ident());
      s = "aa    \taa";
      assert.equal("aa aa", parser(s), "combine whitespaces returns words with single space between");
    });
  });
});
