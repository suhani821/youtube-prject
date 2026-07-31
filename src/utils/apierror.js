class ApiError extends Error {
    constructor(message = "something went wrong", statusCode, errors = [], errstack = "") {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.success = false;
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export default ApiError;