import client from './client';

export function login(username: string, password: string) {
    client.post('/api/v1/auth', { username, password });
}

export function check() {
    client.get('/api/auth');
}
