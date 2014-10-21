(function() {

    'use strict';

    module.exports = function(grunt) {
        var config, errorHandler, name, pkg, taskArray, taskName, tasks, verbose, _results;

        pkg = grunt.file.readJSON('package.json');

        verbose = grunt.option('verbose');

        errorHandler = function(err, req, res, next) {
            var errString, _ref, _ref1;
            errString = (_ref = (_ref1 = err.code) != null ? _ref1.red : void 0) != null ? _ref : err.toString().red;
            return grunt.log.warn(errString, req.url.yellow);
        };

        config = {
            clean: {
                main: ['build']
            },
            copy: {
                main: {
                    files: [{
                        expand: true,
                        cwd: 'src/',
                        src: ['**', '!**/*.sass', '!**/*.scss'],
                        dest: "build/"
                    }]
                }
            },
            compass: {
                dist: {
                    options: {
                        config: 'config.rb'
                    }
                }
            },
            cssmin: {
                main: {
                    expand: true,
                    cwd: 'src/styles/',
                    src: ['*.css'],
                    dest: 'build/'
                }
            },
            uglify: {
                options: {
                    mangle: false
                },
                main: {
                    files: [{
                        expand: true,
                        cwd: 'src/scripts/vendor',
                        src: ['jquery-1.8.3.min.js'],
                        dest: 'build/arquivos'
                    },{
                        'build/arquivos/projeto.min.js': [
                            'src/scripts/projeto.js',
                            'src/scripts/app/constructors/**/*.js',
                            'src/scripts/app/modules/**/*.js',
                            'src/scripts/app/pages/**/*.js',
                            'src/scripts/app/*.js'
                        ]
                    }]
                }
            },
            imagemin: {
                main: {
                    files: [{
                        expand: true,
                        cwd: 'src/images',
                        src: ['**/*.{png,jpg,gif,ico}'],
                        dest: 'build/arquivos/'
                    }]
                }
            },
            watch: {
                options: {
                    livereload: true
                },
                images: {
                    files: ['src/**/*.{png,jpg,gif,ico}'],
                    tasks: ['imagemin']
                },
                css: {
                    files: ['build/**/*.css']
                },
                main: {
                    files: ['src/**/*.html', 'src/**/*.js', 'src/**/*.css'],
                    tasks: ['copy']
                },
                compass: {
                    files: ['sass/**/*.scss'],
                    tasks: ['compass']
                },
                grunt: {
                    files: ['Gruntfile.js']
                },
                js: {
                    files: ['src/scripts/**/*.js'],
                    tasks: ['uglify']
                }

            }
        };
        tasks = {
            build: ['clean', 'compass', 'copy:main', 'imagemin', 'uglify'],
            min: ['uglify', 'cssmin'],
            dist: ['build', 'min'],
            test: [],
            "default": ['build', 'watch'],
            devmin: ['build', 'min', 'connect:http:keepalive']
        };

        grunt.initConfig(config);
        for (name in pkg.devDependencies) {
            if (name.slice(0, 6) === 'grunt-') {
                grunt.loadNpmTasks(name);
            }
        }

        _results = [];
        for (taskName in tasks) {
            taskArray = tasks[taskName];
            _results.push(grunt.registerTask(taskName, taskArray));
        }
        return _results;
    };

}).call(this);