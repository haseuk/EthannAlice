// Grunt
module.exports = function(grunt) {

  grunt.initConfig({

    // jshint.
    jshint: {
      files: [
        'Gruntfile.js',
        'js/**/*.js',
      ],
      options: {
        globals: {
          jQuery: true,
        }
      },
    },

    // sass.
    sass: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'css/header-footer.css': 'scss/header-footer.scss',
        }
      }
    },

    // watch.
    watch: {
      set1: {
        files: 'scss/**/*.scss',
        tasks: ['sass'],
      },
    },

    autoprefixer: {
      options: {
         browsers: ['last 2 versions', 'ie 9', 'ie 10']
      },
      no_dest_single: {
        src: 'css/**/*.css'
      },
    },

    // notify.
    notify_hooks: {
      options: {
        title: "Grunt",
        enabled: true,
        success: true,
        duration: 2,
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-autoprefixer');

  grunt.registerTask('default', ['sass', 'autoprefixer']);

  grunt.task.run('notify_hooks');

};
