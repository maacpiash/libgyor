function appErrorHandler(err, req, res, next) {
  console.log(new Date().toLocaleString(), req.method, err.statusCode, err.message);
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