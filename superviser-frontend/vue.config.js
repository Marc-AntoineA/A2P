module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/administration/'
    : '/',
    assetsDir: process.env.NODE_ENV === 'production'
    ? 'static-superviser/'
    : ''
}
