module.exports = (req, res, next) => {
  res.render('addApi', {
    pageTitle: 'Monitor a New App',
    pageName: 'addApi'
  });
}