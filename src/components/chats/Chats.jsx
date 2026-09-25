import HeaderChats from "../header-chats/Header-chat";
import './Chats.scss';

export default function Chats({contacts, onOpenModalFindPhone}) {
    return (
        <div className="chats">
            <HeaderChats onOpenModalFindPhone={onOpenModalFindPhone}/>

            <div className="chats__contacts contacts">
                {contacts.length
                    ? (<div className="contacts__list"></div>)
                    : (
                        <div className="contacts__empty empty">
                            <div className="empty__logo">
                                <img src="./chat.svg"/>
                            </div>

                            <div className="empty__description">
                                <p>В папке пока нет чатов</p>
                            </div>
                            <div className="empty__add-chat">
                                <button>Добавить чаты</button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}