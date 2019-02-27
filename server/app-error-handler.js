function appErrorHandler(err, req, res, next) {
  console.log('ERROR', err);
  if (err.statusCode) {    
    res.status(err.statusCode);
    res.send({
      message: err.message
    });
    return;
  }
  next(err);
}

module.exports = appErrorHandler;