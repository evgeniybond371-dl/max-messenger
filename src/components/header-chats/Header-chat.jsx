import './Header-chat.scss';

export default function HeaderChats({onOpenModalFindPhone}) {
    return (
        <div className="header">
            <div className="header__title-action">
                <h2 className="header__title">Чаты</h2>
                <div className="header__add-action" onClick={() => onOpenModalFindPhone(true)}>+</div>
            </div>
            <div className="header__search">
                <input
                    type="text"
                    placeholder='Найти'
                />
            </div>
        </div>
    );
}