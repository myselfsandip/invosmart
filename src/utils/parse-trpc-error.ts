interface ValidationError {
    code: string;
    message: string;
    path: string[];
}

export function parseTRPCError(error: any): string {
    try {
        const errorData = error?.shape?.data || error?.data;
        const errorMessage = error?.shape?.message || error?.message;

        if (errorData?.code === 'BAD_REQUEST' && errorMessage) {
            try {
                const errors: ValidationError[] = JSON.parse(errorMessage);

                if (Array.isArray(errors) && errors.length > 0) {
                    return errors
                        .map(err => {
                            const field = err.path[0] || 'Field';
                            const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
                            return `${fieldName}: ${err.message}`;
                        })
                        .join('\n');
                }
            } catch (parseError) {
                return errorMessage;
            }
        }

        return errorMessage || 'An unexpected error occurred';
    } catch {
        return 'An unexpected error occurred';
    }
}
