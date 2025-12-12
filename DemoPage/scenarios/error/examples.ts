export interface ErrorExample {
    id: string;
    label: string;
    error: {
        code: string;
        message: string;
        status?: number;
        field?: string;
        details?: string;
    };
}

export const ERROR_EXAMPLES: ErrorExample[] = [
    {
        id: "auth_expired",
        label: "401 - Session Expired",
        error: {
            code: "AUTH_TOKEN_EXPIRED",
            message: "The authentication token has expired",
            status: 401,
            details: "Token expiry: 2024-12-09T10:30:00Z, Current time: 2024-12-09T14:45:00Z"
        }
    },
    {
        id: "rate_limit",
        label: "429 - Rate Limited",
        error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests. Please retry after 60 seconds.",
            status: 429,
            details: "Limit: 100 req/min, Current: 147 req/min, Retry-After: 60"
        }
    },
    {
        id: "validation",
        label: "400 - Validation Error",
        error: {
            code: "VALIDATION_ERROR",
            message: "Invalid input: email format is incorrect",
            status: 400,
            field: "email",
            details: "Expected format: user@domain.com, Received: user@"
        }
    },
    {
        id: "not_found",
        label: "404 - Resource Not Found",
        error: {
            code: "RESOURCE_NOT_FOUND",
            message: "The requested order could not be found",
            status: 404,
            details: "Order ID: ORD-2024-98765 does not exist or has been deleted"
        }
    },
    {
        id: "payment",
        label: "402 - Payment Failed",
        error: {
            code: "PAYMENT_DECLINED",
            message: "Card was declined by the issuing bank",
            status: 402,
            details: "Decline code: insufficient_funds, Card ending: 4242"
        }
    },
    {
        id: "conflict",
        label: "409 - Conflict Error",
        error: {
            code: "DUPLICATE_ENTRY",
            message: "A user with this email already exists",
            status: 409,
            field: "email",
            details: "Existing account created: 2023-06-15"
        }
    },
    {
        id: "server",
        label: "500 - Internal Server Error",
        error: {
            code: "INTERNAL_ERROR",
            message: "An unexpected error occurred while processing your request",
            status: 500,
            details: "Reference ID: err_abc123xyz, Timestamp: 2024-12-09T14:30:00Z"
        }
    },
    {
        id: "timeout",
        label: "504 - Gateway Timeout",
        error: {
            code: "GATEWAY_TIMEOUT",
            message: "The request timed out while waiting for upstream server",
            status: 504,
            details: "Timeout after 30000ms, Service: payment-processor"
        }
    },
    {
        id: "maintenance",
        label: "503 - Service Unavailable",
        error: {
            code: "SERVICE_MAINTENANCE",
            message: "The service is temporarily unavailable due to scheduled maintenance",
            status: 503,
            details: "Maintenance window: 2024-12-09 14:00-16:00 UTC"
        }
    },
    {
        id: "permission",
        label: "403 - Permission Denied",
        error: {
            code: "PERMISSION_DENIED",
            message: "You don't have permission to access this resource",
            status: 403,
            details: "Required role: admin, Current role: viewer, Resource: /api/admin/users"
        }
    }
];


