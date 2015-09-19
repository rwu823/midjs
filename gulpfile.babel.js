var gu = require('gulp')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var webpack = require('webpack')

function dev (){

}

function build(){
    return gu.src('mid.js')
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gu.dest('./'))
}

gu
    .task('dev', dev)
    .task('build', build)