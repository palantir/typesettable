module.exports = function(grunt) {
  "use strict";

  var path = require("path");
  var cwd = process.cwd();

  var tsJSON = {
    dev: {
      src: ["svgtextwriter.ts", "typings/d3/d3.d.ts"],
      outDir: ".",
      options: {
        target: 'es5',
        noImplicitAny: false,
        sourceMap: false,
        declaration: true,
        compiler: "./node_modules/grunt-ts/customcompiler/tsc",
        removeComments: false
      }
    }
  };

  // poor man's deep copy
  var deepCopy = function(x) {
    return JSON.parse(JSON.stringify(x));
  };

  tsJSON.dev_release = deepCopy(tsJSON.dev);
  delete tsJSON.dev_release.options.compiler;

  var bumpJSON = {
    options: {
      files: ['package.json', 'bower.json'],
      updateConfigs: ['pkg'],
      commit: false,
      createTag: false,
      push: false
    }
  };
  var configJSON = {
    pkg: grunt.file.readJSON("package.json"),
    bump: bumpJSON,
    concat: {
      header: {
        src: ["license_header.txt", "svgtextwriter.js"],
        dest: "svgtextwriter.js",
      }
    },
    sed: {
      version_number: {
        pattern: "@VERSION",
        replacement: "<%= pkg.version %>",
        path: "svgtextwriter.js"
      }
    },
    ts: tsJSON,
    tslint: {
      options: {
        configuration: grunt.file.readJSON("tslint.json")
      },
      files: ["*.ts"]
    },
    jshint: {
      files: ['Gruntfile.js', 'quicktests/**/*.js'],
      options: {
          "curly": true,
          "eqeqeq": true,
          "evil": true,
          "indent": 2,
          "latedef": true,
          "globals": {
            "jQuery": true,
            "d3": true,
            "window": true,
            "console": true,
            "$": true,
            "makeRandomData": true,
            "setTimeout": true,
            "document": true
          },
          "strict": true,
          "eqnull": true
      }
    },
    watch: {
      "options": {
        livereload: 35731
      },
      "rebuild": {
        "tasks": ["dev-compile"],
        "files": ["svgtextwriter.ts"]
      }
    },
    connect: {
      server: {
        options: {
          port: 9998,
          hostname: "*",
          base: "",
          livereload: 35731
        }
      }
    },
    clean: {
      tscommand: ["tscommand*.tmp.txt"]
    },
    uglify: {
      main: {
        files: {'svgtextwriter.min.js': ['svgtextwriter.js']}
      }
    }
  };


  // project configuration
  grunt.initConfig(configJSON);

  require('load-grunt-tasks')(grunt);

  grunt.registerTask("default", "launch");
  function makeDevCompile(release) {
    return [
      release ? "ts:dev_release" : "ts:dev",
      "concat:header",
      "sed",
      "clean:tscommand"
    ];
  }

  grunt.registerTask("dev-compile", makeDevCompile(false));
  grunt.registerTask("release-compile", makeDevCompile(true));

  grunt.registerTask("release:patch", ["bump:patch", "dist-compile"]);
  grunt.registerTask("release:minor", ["bump:minor", "dist-compile"]);
  grunt.registerTask("release:major", ["bump:major", "dist-compile"]);

  grunt.registerTask("dist-compile", [
                                  "release-compile",
                                  "tslint",
                                  "uglify",
                                  ]);


  grunt.registerTask("launch", ["connect", "dev-compile", "watch"]);
};
