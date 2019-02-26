function appErrorHandler(err, req, res, next) {
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