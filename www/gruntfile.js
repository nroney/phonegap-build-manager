module.exports = function(grunt) {

var includedFiles = ['js/*.js', 'js/libs/*.js', 'js/views/*.js', 'js/models/*.js']

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
    options: {
      mangle: false,
      beautify: false,
      preserveComments: true
    },
    my_target: {
      files: {
        'dist/js/output.min.js': includedFiles
      }
    }
  },
  
          'jsbeautifier' : {
    files : ['dist/js/output.min.js'],
    options : {
    }
},
'sails-linker': {
 release: {
      options: {
        startTag: '<!--SCRIPTS-->',
        endTag: '<!--SCRIPTS END-->',
        fileTmpl: '<script src="%s"></script>',
        appRoot: ''
      },
      files: {
        // Target-specific file lists and/or options go here.
        'index.html':['dist/js/output.min.js']
      },
    },

    dev: {
      options: {
        startTag: '<!--SCRIPTS-->',
        endTag: '<!--SCRIPTS END-->',
        fileTmpl: '<script src="%s"></script>',
        appRoot: ''
      },
      files: {
        // Target-specific file lists and/or options go here.
        'index.html':includedFiles
      },
    },
  },
jshint: {
    options: {
      curly: true,
      eqeqeq: true,
      eqnull: false,
      browser: false,
      globals: {
        jQuery: true
      },
    },
    uses_defaults: ['dir1/**/*.js', 'dir2/**/*.js'],
    with_overrides: {
      options: {
        curly: false,
        undef: false,
      },
      files: {
        src: ['js/*.js', 'js/libs/*.js', 'js/views/*.js']
      },
    }
  }
    
    
    
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsbeautifier');
  grunt.loadNpmTasks('grunt-sails-linker');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Default task(s).
  grunt.registerTask('release', ['uglify', 'sails-linker:release']);
  grunt.registerTask('dev', ['jsbeautifier', 'sails-linker:dev' ]);

};

