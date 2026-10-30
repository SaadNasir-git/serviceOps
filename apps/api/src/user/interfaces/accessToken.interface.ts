export interface AccessToken {
    userId: string,
    email: string,
    name: string,
    deviceId: string,
    role: 'admin' | 'technician' | 'customer'
}