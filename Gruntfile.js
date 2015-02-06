/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n' +
        '\n\'use strict\';\n',

        // Task configuration.
        concat: {
            options: {
                // Replace all 'use strict' statements in the code with a single one at the top
                banner: '<%= banner %>',
                process: function(src, filepath) {
                  return '// Source: ' + filepath + '\n' +
                    src.replace(/(^|\n)[ \t]*('use strict'|"use strict");?\s*/g, '$1');
                }
                /*
                stripBanners: true*/
            },
            lib: {
                src: [
                    'src/dbs.js',
                    'src/dbs.types.js',
                    'src/dbs.utils.js',
                    'src/dbs.types.*.js'
                ],
                dest: 'dist/lib/<%= pkg.name %>.js'
            },
            app: {
                src: ['app/js/*.js'],
                dest: 'dist/app/js/dbsapp.js'  
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                mangle: {
                    except: ['angular', 'DBS']
                }
            },
            lib: {
                src: '<%= concat.lib.dest %>',
                dest: 'dist/lib/<%= pkg.name %>.min.js'
            },
            app: {
                src: '<%= concat.app.dest %>',
                dest: 'dist/app/js/dbsapp.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                globals: {
                    d3: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['src/*.js', 'tests/lib/**/*.spec.js'],
            },
            app: {
                src: ['app/js/*.js', 'tests/app/**/*.spec.js']
            }
        },
        jasmine: {
            lib: {
                src: '<%= concat.lib.src %>',
                options: {
                    vendor: './bower_components/d3/d3.js',
                    specs: ['./tests/lib/**/*.spec.js']
                }
            },
            app: {
                src: '<%= concat.app.src %>',
                options: {
                    specs: '<%= jshint.app.src[1] %>'
                }
            }
        },
        copy: {
            production: {
                files: [
                    {expand: false, src:['app/css/dbsapp.css'], dest: 'dist/app/css/dbsapp.css'},
                    {expand: false, src:['src/css/dbs.css'], dest: 'dist/lib/css/dbs.css', filter: 'isFile'},
                    {expand: false, src:['app/partials/*.html'], dest: 'dist/'},
                    {expand: true, flatten: true, src:['bower_components/angular*/*.min.js', 'bower_components/angular*/*.min.js.map'], dest: 'dist/app/js/', filter: 'isFile'},
                    {expand: true, flatten: true, src:['bower_components/bootstrap/dist/css/*'], dest: 'dist/app/css/bootstrap/css/', filter: 'isFile'},
                    {expand: true, flatten: true, src:['bower_components/bootstrap/dist/fonts/*'], dest: 'dist/app/css/bootstrap/fonts/', filter: 'isFile'},
                    {expand: true, flatten: true, src:['bower_components/fontawesome/css/*'], dest: 'dist/app/css/fontawesome/css/', filter: 'isFile'},
                    {expand: true, flatten: true, src:['bower_components/fontawesome/fonts/*'], dest: 'dist/app/css/fontawesome/fonts/', filter: 'isFile'},
                    {expand: true, flatten: true, src:['bower_components/d3/*.min.js'], dest: 'dist/app/js/', filter: 'isFile'}
                ]
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib.src %>',
                tasks: ['jasmine:lib']
            },
            /*app_test: {
                files: '<%= jshint.app.src %>',
                tasks: ['jasmine:app']
            },*/
            development_less: {
                files: ['src/css/*.less', 'app/css/*.less'],
                tasks: ['less:development']  
            }
        },
        less: {
            development: {
                options: {
                    paths: ['src/css', 'app/css']
                },
                files: {
                  'src/css/dbs.css': 'src/css/dbs.less',
                  'app/css/dbsapp.css': 'app/css/dbsapp.less'
                }
              }
              /*,
              production: {
                options: {
                  paths: ["assets/css"],
                  plugins: [
                    new require('less-plugin-autoprefix')({browsers: ["last 2 versions"]}),
                    new require('less-plugin-clean-css')(cleanCssOptions)
                  ],
                  modifyVars: {
                    imgPath: '"http://mycdn.com/path/to/images"',
                    bgColor: 'red'
                  }
                },
                files: {
                  "path/to/result.css": "path/to/source.less"
                }
              }*/
        },
        processhtml: {
            options: {

            },
            dist: {
                files: {
                    'dist/app/index.html': ['app/index.html']
                }
            }
        }
        });

        grunt.loadNpmTasks('grunt-contrib-concat');
        grunt.loadNpmTasks('grunt-contrib-uglify');
        grunt.loadNpmTasks('grunt-contrib-jshint');
        grunt.loadNpmTasks('grunt-contrib-watch');
        grunt.loadNpmTasks('grunt-contrib-jasmine');
        grunt.loadNpmTasks('grunt-contrib-less');
        grunt.loadNpmTasks('grunt-contrib-copy');
        grunt.loadNpmTasks('grunt-processhtml');

        // Default task.
        grunt.registerTask('default', ['less', 'concat', 'uglify', 'processhtml', 'copy']);
        grunt.registerTask('wait', ['watch']);
        grunt.registerTask('test-app', ['jasmine:app']);
        grunt.registerTask('test-lib', ['jasmine:lib']);
        grunt.registerTask('test', ['jasmine']);
        grunt.registerTask('css', ['less']);

        };