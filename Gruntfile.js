(function() {

    'use strict';

    module.exports = function(grunt) {
        var config, environment, errorHandler, name, open, pkg, taskArray, taskName, tasks, verbose, _results;

        pkg = grunt.file.readJSON('package.json');

        environment = process.env.VTEX_HOST || 'vtexcommerce';

        verbose = grunt.option('verbose');

        open = pkg.accountName ? "http://" + pkg.accountName + ".vtexlocal.com.br/?debugcss=true&debugjs=true&refresh=true" : void 0;

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
                        src: ['modernizr.min.js'],
                        dest: 'build/arquivos'
                    },{
                        'build/arquivos/luxe.min.js': [
                            'src/scripts/vendor/jquery.mCustomScrollbar.js',
                            'src/scripts/vendor/owl.carousel.min.js',
                            'src/scripts/vendor/royal.js',
                            'src/scripts/vendor/jqinstapics.min.js',
                            'src/scripts/luxe.js',
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
            connect: {
                http: {
                    options: {
                        hostname: "*",
                        open: open,
                        port: process.env.PORT || 80,
                        middleware: [
                            require('connect-livereload')({
                                disableCompression: true
                            }),
                            require('connect-http-please')({
                                replaceHost: (function(h) {
                                    return h.replace("vtexlocal", environment);
                                })
                            }, {
                                verbose: verbose
                            }),
                            require('connect-tryfiles')('**', "http://portal." + environment + ".com.br:80", {
                                cwd: 'build/',
                                verbose: verbose
                            }), require('connect')["static"]('./build/'), errorHandler
                        ]
                    }
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
            "default": ['build', 'connect', 'watch'],
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