import './Empty-chat.scss';

export default function EmptyChat () {
    return (
        <div className="empty">
            <p className="empty__title">Сообщений пока нет</p>
            <p className="empty__subtitle">Напишите сообщение или отправьте стикер</p>
        </div>
    );
}