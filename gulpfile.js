const src = require('gulp').src;
const dest = require('gulp').dest;
const series = require('gulp').series;
const parallel = require('gulp').parallel;
const del = require('del');
const log = require('fancy-log');

const paths = {
  react_src: 'src/main/ui/build/**/*',
  react_dist: 'src/main/resources/static/'
};

function clean()  {
  log('removing the old files in the directory')
  return del('src/main/resources/static/**', {force:true});
}

function copyReactCodeTask() {
  log('copying React code into the directory')
  return src(`${paths.react_src}`)
        .pipe(dest(`${paths.react_dist}`));
}

const _default = series(
  clean,
  copyReactCodeTask
);

exports.default = _default