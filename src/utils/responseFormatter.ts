
export function formatSuccess(data: any, message = 'OK') {
    return {        
        success: true,
        message,
        data,
    };
}
  
export function formatError(error: any, statusCode = 500) {
    return {        
        success: false,
        statusCode,
        message: error?.message || 'Internal Server Error',
        error,
    };
}
  