module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    
    config = {};

    try {
        config = require('./config');
    } catch (e) {
        console.log('Empty config will be used as config file failed to load with error:\n' + e);
        config = {
            base: {
                android: '',
                ios: '',
                html: ''
            }
        };
    }

    grunt.registerTask('initRequireJS', function() {
        var done = this.async();
        var sys = require('sys');
        var exec = require('child_process').exec;
        exec('git rev-parse HEAD', function(err, out){
            grunt.config(['requirejs'], {
                dev: {
                    options: {
                        baseUrl: 'ArticleTemplates/assets/js',
                        mainConfigFile: 'ArticleTemplates/assets/js/main.js',
                        dir: 'ArticleTemplates/assets/build',
                        optimize: 'uglify2',
                        generateSourceMaps: false,
                        preserveLicenseComments: false,
                        useSourceUrl: false,
                        removeCombined: true,
                        modules: [
                            { name: 'app' },
                            { name: 'article' },
                            { name: 'audio' },
                            { name: 'cricket' },
                            { name: 'football' },
                            { name: 'gallery' },
                            { name: 'liveblog' },
                            { name: 'video' },
                            { name: 'bootstraps/common'}
                        ]
                    }
                }
            });
            done();
        });
    });

    grunt.initConfig({
        // sync templates to local ios/android projects
        rsync: {
            options: {
                recursive: true,
                delete: true
            },
            android: {
                options: {
                    src: 'ArticleTemplates/',
                    dest: config.base.android
                }
            },
            ios: {
                options: {
                    src: 'ArticleTemplates/',
                    dest: config.base.ios
                }
            }
        },
        // stylesheets
        sasslint: {
            options: {
                configFile: 'ArticleTemplates/assets/scss/sass-lint.yml'
            },
            target: [
                'ArticleTemplates/assets/scss/**/!(vendor)/*.scss'
            ]
        },
        sass: {
            dist: {
                files: {
                    'ArticleTemplates/assets/css/fonts-android.css':  'ArticleTemplates/assets/scss/fonts-android.scss',
                    'ArticleTemplates/assets/css/fonts-ios.css':  'ArticleTemplates/assets/scss/fonts-ios.scss',
                    'ArticleTemplates/assets/css/fonts-windows.css':  'ArticleTemplates/assets/scss/fonts-windows.scss',
                    'ArticleTemplates/assets/css/interactive.css':  'ArticleTemplates/assets/scss/interactive.scss',
                    'ArticleTemplates/assets/css/outbrain.css':  'ArticleTemplates/assets/scss/outbrain.scss',
                    'ArticleTemplates/assets/css/style-async.css':  'ArticleTemplates/assets/scss/style-async.scss',
                    'ArticleTemplates/assets/css/style-sync.css':  'ArticleTemplates/assets/scss/style-sync.scss',
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'ArticleTemplates/assets/css',
                    src: ['*.css'],
                    dest: 'ArticleTemplates/assets/css',
                    ext: '.css'
                }]
            }
        },
        // jshint
        jshint: {
            options: {
                reporter: require('jshint-summary'),
                force: true
            },
            uses_defaults: [
                'Gruntfile.js', 
                'ArticleTemplates/assets/js/{bootstraps, modules}/*.js'
            ],
            with_overrides: {
                options: {
                    'bitwise': true,
                    'browser': true,
                    'camelcase': true,
                    'curly': true,
                    'eqeqeq': true,
                    'expr': true,
                    'forin': true,
                    'immed': true,
                    'indent': false,
                    'latedef': false,
                    'maxerr': 9999,
                    'mocha': true,
                    'newcap': true,
                    'noarg': true,
                    'noempty': true,
                    'nonew': true,
                    'quotmark': 'single',
                    'regexp': true,
                    'strict': true,
                    'trailing': true,
                    'undef': true,
                    'unused': true,
                    'white': true,
                    'predef': [ '-Promise' ],
                    'globals': {
                        'console': true,
                        'GU': true,
                        'require': true,
                        'define': true,
                        'sinon': true,
                        'expect': true,
                        'twttr': true,
                        'YT': true
                    }
                },
                files: {
                    src: [
                        'ArticleTemplates/assets/js/*.js',
                        'ArticleTemplates/assets/js/bootstraps/*.js',
                        'ArticleTemplates/assets/js/modules/*.js',
                        'test/spec/unit/**/*.js'
                    ]
                }
            }
        },
        // unit tests
        karma: {
            unit: {
                options: {
                    basePath: './',
                    frameworks: ['mocha', 'requirejs', 'chai-sinon'],
                    files: [
                        {pattern: 'ArticleTemplates/assets/js/**/*.js' , included: false},
                        {pattern: 'test/spec/unit/**/*.js', included: false},
                        {pattern: 'node_modules/d3/d3.js', included: false},
                        {pattern: 'node_modules/domready/ready.js', included: false},
                        {pattern: 'node_modules/fastclick/lib/fastclick.js', included: false},
                        {pattern: 'node_modules/fence/fence.js', included: false},
                        {pattern: 'node_modules/smooth-scroll/dist/js/smooth-scroll.js', included: false},
                        {pattern: 'node_modules/squirejs/src/Squire.js', included: false},
                        'test/spec/unit/test-main.js'
                    ],
                    exclude: [
                        'ArticleTemplates/assets/js/main.js'
                    ],
                    reporters: ['mocha', 'coverage'],
                    preprocessors: {
                        'ArticleTemplates/assets/js/*.js': ['coverage'],
                        'ArticleTemplates/assets/js/bootstraps/*.js': ['coverage'],
                        'ArticleTemplates/assets/js/modules/*.js': ['coverage']
                    },
                    coverageReporter: {
                        reporters: [{
                            type: 'cobertura',
                            dir: 'test/output/coverage/',
                            file: 'summary.xml'
                        }, {
                            type : 'html',
                            dir : 'test/output/coverage/'
                        }]
                    },
                    port: 9876,
                    colors: true,
                    autoWatch: true,
                    singleRun: true,
                    logLevel: 'ERROR',
                    browsers: ['PhantomJS']
                }
            }
        },
        // watch
        watch: {
            js: {
                files: ['ArticleTemplates/assets/js/**/*.js'],
                tasks: ['buildJS','rsync']
            },
            scss: {
                files: ['ArticleTemplates/assets/scss/**/*.scss'],
                tasks: ['buildCSS','rsync']
            },
            copy: {
                files: ['ArticleTemplates/*.html', 'ArticleTemplates/assets/img/**'],
                tasks: ['rsync']
            }
        },
        // desktop notifications for Grunt errors 
        notify_hooks: {
            options: {
                enabled: true,
                max_jshint_notifications: 5,
                success: true,
                duration: 3
            }
        }
    });

    grunt.task.run('notify_hooks');

    grunt.registerTask('buildJS', ['jshint', 'karma', 'initRequireJS', 'requirejs']);

    grunt.registerTask('buildCSS', ['sasslint', 'sass', 'cssmin']);

    grunt.registerTask('build', ['buildJS', 'buildCSS']);

    grunt.registerTask('default', 'watch');
};
