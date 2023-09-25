// FrappeCall.js
export function FrappeCall(method, args) {
    return fetch('/api/method/' + method, {
        method: 'POST',
        headers: {
            "X-Frappe-CSRF-Token": window.csrf_token,
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(args)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                return data.message;
            } else {
                throw new Error(data._server_messages || 'Unknown server error');
            }
        });
}
