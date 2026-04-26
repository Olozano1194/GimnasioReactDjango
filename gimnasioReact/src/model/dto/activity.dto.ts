export interface Activity {
    id: string;
    type: 'new_member' | 'entry' | 'payment' | 'warning';
    icon: string;
    color: 'primary' | 'info' | 'success' | 'warning';
    title: string;
    description: string;
    amount?: number;
    created_at: string;
    time_ago: string;
}