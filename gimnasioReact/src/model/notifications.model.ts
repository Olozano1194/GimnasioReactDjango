export interface Notification {
    type: 'warning' | 'danger' | 'info' | 'success';
    title: string;
    message: string;
    date: string;
    link: string;
}