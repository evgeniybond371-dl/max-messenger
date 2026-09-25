export interface IMessage {
    id: number;
    text: string;
    status: 'success' | 'error' | 'send' | 'received';
    time: string;
};
