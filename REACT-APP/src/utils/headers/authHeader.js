export const authHeaders = (token, csurfTk) => {
    return {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
       'X-CSRF-TOKEN': csurfTk,
        credentials: 'include'
    }
}