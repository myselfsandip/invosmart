export interface FileToBase64Options {
    maxSizeMB?: number;
    allowedTypes?: string[];
}

export interface FileToBase64Result {
    success: boolean;
    base64?: string;
    error?: string;
}


export async function fileToBase64(
    file: File,
    options: FileToBase64Options = {}
): Promise<FileToBase64Result> {
    const {
        maxSizeMB = 5,
        allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"],
    } = options;

    if (!allowedTypes.includes(file.type)) {
        return {
            success: false,
            error: `Invalid file type. Allowed: ${allowedTypes.join(", ")}`,
        };
    }

    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
        return {
            success: false,
            error: `File size must be less than ${maxSizeMB}MB`,
        };
    }

    return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onloadend = () => {
            resolve({
                success: true,
                base64: reader.result as string,
            });
        };

        reader.onerror = () => {
            resolve({
                success: false,
                error: "Failed to read file",
            });
        };

        reader.readAsDataURL(file);
    });
}
