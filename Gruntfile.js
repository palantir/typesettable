module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      examples: {
        src: ['examples/**/*', '!**/_*/**'],
        dest: '_includes/',
        filter: 'isFile'
      }
    },
    watch: {
      scripts: {
        files: ['js/*.js', 'images/*', '*.html'],
        tasks: ['concat', 'uglify', 'newer:imagemin', 'newer:svgmin'],
        options: { spawn: false }
      },
      examples: {
        files: ['examples/**/*'],
        tasks: ['copy:examples'],
        options: { spawn: false }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('default', ['copy']);
}
