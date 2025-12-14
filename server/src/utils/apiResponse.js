class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        this.timestamp = new Date().toISOString();
    }

    static ok(data, message = "Success") {
        return new ApiResponse(200, data, message);
    }

    static created(data, message = "Created") {
        return new ApiResponse(201, data, message);
    }

    static accepted(data, message = "Accepted") {
        return new ApiResponse(202, data, message);
    }

    static noContent(message = "No Content") {
        return new ApiResponse(204, null, message);
    }

    static paginated(data, page, limit, total, message = "Success") {
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrev = page > 1;

        return new ApiResponse(200, {
            items: data,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext,
                hasPrev
            }
        }, message);
    }
}

module.exports = ApiResponse;
