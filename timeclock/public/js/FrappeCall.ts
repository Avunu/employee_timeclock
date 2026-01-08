declare global {
    interface Window {
        csrf_token: string;
    }
}

interface FrappeResponse<T> {
    message?: T;
    _server_messages?: string;
}

export async function frappeCall<T = unknown>(
    method: string,
    args: Record<string, unknown> = {}
): Promise<T> {
    const response = await fetch(`/api/method/${method}`, {
        method: 'POST',
        headers: {
            'X-Frappe-CSRF-Token': window.csrf_token,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(args),
    });

    if (!response.ok) {
        throw new Error(`Network error: ${response.status} ${response.statusText}`);
    }

    const data: FrappeResponse<T> = await response.json();

    if (data.message !== undefined) {
        return data.message;
    }

    throw new Error(data._server_messages || 'Unknown server error');
}
