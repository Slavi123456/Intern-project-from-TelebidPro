export class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFoundError";
    }
}

export class MethodNotAllowed extends Error {
    constructor(message) {
        super(message);
        this.name = "MethodNotAllowed";
    }
}

export class BadRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = "BadRequestError";
    }
}
export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}