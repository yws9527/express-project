module.exports = {
  notFound(req, res, next) {
    res.status(404).send('404 Not Found');
  },
  errorHandler(error, req, res, next) {
    res.status(500).send('Service Error');
  }
}