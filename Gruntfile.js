module.exports = function(grunt) {
    
    //Carrega informações de arquivos
    var configAutoPrefixer = grunt.file.readJSON('grunt/configBridge.json', { encoding: 'utf8' });


    // require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
    
    //Configurações
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: 'dist'
        },
        //Variavel
        less:{
            //Tarefa
            compilarLess:{
                options:{
                    strictMath: true,
                    sourceMap: true,
                    outputSourceFiles: true,
                    sourceMapURL: 'teste.css.map',
                    sourceMapFilename: 'dist/css/teste.css.map'                    
                },
                src: 'less/teste.less',
                dest: 'dist/css/teste.css'     
            }
        },
        autoprefixer: {
            //Tarefa que analisa os arquivos CSS criados e adiciona todos os VENDORS necessários
            options: {
                browsers: configAutoPrefixer.config.autoprefixerBrowsers
            },
            dist: {
                options: {
                    map: true
                },
                src: 'dist/css/teste.css'
            }
        },
        cssmin: {
            //Tarefa para minificar os arquivos de CSS
            options: {
                compatibility: 'ie8',
                keepSpecialComments: '*',
                noAdvanced: true
            }
            ,dist: {
                src: 'dist/css/teste.css',
                dest: 'dist/css/teste.min.css'
            }
        },
        csslint: {
            options: {
                csslintrc: 'less/.csslintrc'
            },
            dist: [
                'dist/css/teste.css'
            ]
        },
        csscomb: {
            //Tarefa que organiza as propriedades do CSS em ordem alfabetica
            options: {
                config: 'less/.csscomb.json'
            }
            ,dist: {
                expand: true,
                cwd: 'dist/css/',
                src: ['*.css', '!*.min.css'],
                dest: 'dist/css/'
            }
        },
        concat: {
            options: {
                //banner: '<%= banner %>\n<%= jqueryCheck %>\n<%= jqueryVersionCheck %>',
                stripBanners: false
            },
            all: {
                src: [
                    'js/modal.js',
                    'js/popover.js'
                    ],
                dest: 'dist/js/<%= pkg.name %>.js'
            }
        },
        uglify: {
            options: {
                compress: {
                    warnings: false
                },
                mangle: true,
                preserveComments: 'some'
            },
            all: {
                src: '<%= concat.all.dest %>',
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },
        copy: {
            fonts: {
                expand: true,
                src: 'fonts/*',
                dest: 'dist/'
            }
        },
        htmlmin: {                                     
            dist: {                                     
                options: {                              
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/index.html': 'src/index.html'
                }
            }
        },
        watch:{
            options:{
                livereload: true
            },
            less:{
                files: 'less/*.less',
                tasks: 'less',
            },
            html:{
                files: 'dist/index.html'
            }
        },
        express:{
            all:{
                options:{
                    port:9000,
                    hostname:'localhost',
                    bases:['dist/.'],
                    livereload:true
                }
            }
        },
        open: {
            all: {
                // Gets the port from the connect configuration
                path: 'http://localhost:<%= express.all.options.port%>'
            }
        }
        
    });
    
    //Carregar os plugins
    //Compila os arquivos LESS em CSS
    grunt.loadNpmTasks('grunt-contrib-less');
    //Adiciona todos os prefixos necessários para as versões de navegadores solicitadas
    grunt.loadNpmTasks('grunt-autoprefixer');
    //Minifica o arquivo CSS
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //
    grunt.loadNpmTasks('grunt-contrib-csslint');
    //
    grunt.loadNpmTasks('grunt-csscomb');
    //
    grunt.loadNpmTasks('grunt-contrib-watch');
    //
    grunt.loadNpmTasks('grunt-express');
    //
    grunt.loadNpmTasks('grunt-open');
    //
    grunt.loadNpmTasks('grunt-contrib-clean');
    //
    grunt.loadNpmTasks('grunt-contrib-concat');
    //
    grunt.loadNpmTasks('grunt-contrib-uglify');
    //
    grunt.loadNpmTasks('grunt-contrib-copy');
    //
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    
    //Tarefas para distribuicao do CSS.
    grunt.registerTask('dist-css', ['clean:dist','less:compilarLess','autoprefixer:dist', 'csslint:dist', 'cssmin:dist', 'csscomb:dist', 'concat:all', 'uglify:all','copy:fonts','htmlmin:dist']);
    
    //Tarefa padrao do GruntJS
    grunt.registerTask('default', ['dist-css']);    

    grunt.registerTask('servidor', ['express','open','watch']);    
    
}