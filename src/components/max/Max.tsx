import { useState } from 'react';
import Chat from '../chat/Chat';
import Chats from '../chats/Chats';
import Modal from "../modal/Modal";
import './Max.scss';
import { API_URL } from '../../constants/fetch.constants';

export default function Max({ credentials, onSendChatId }) {
    const [isOpenModalFindPhone, setIsOpenModalFindPhone] = useState(false);
    const [phone, setPhone] = useState('');
    const [isExistInMax, setIsExistInMax] = useState(false);

    async function getChatIdByPhone(phoneNumber, credentials) {
        const { idInstance, apiTokenInstance } = credentials;
        const url = `${API_URL}/waInstance${idInstance}/checkAccount/${apiTokenInstance}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify({ phoneNumber: Number(phoneNumber) })
            });
            
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`HTTP ${response.status}: ${error}`);
            }

            const responseData = await response.json();
            if (!responseData.exist) {
                throw new Error('На этом номере нет аккаунта в MAX');
            }
            return {
              exist: responseData.exist,
              chatId: responseData.chatId,
            };            
        } catch (error) {
            throw error;
        }
    }

    async function createChat() {
      setIsOpenModalFindPhone(false);
      const { exist, chatId } = await getChatIdByPhone(phone, credentials);

      setIsExistInMax(exist);
      
      if (phone.length === 11 && exist) {
        onSendChatId({chatId});
      } else if (!exist) {
        console.log('Номера нет в MAX');
      }

      // setPhone('');
    }

    return (
        <div className="max">
            <div className="max__menu" style={{display: 'none'}}></div>
            <Chats
              contacts={[]}
              onOpenModalFindPhone={setIsOpenModalFindPhone}
            />
            { credentials.chatId ?? isExistInMax ? (<Chat credentials={credentials} phone={phone}/>) : (
              <div className="max__chat--empty"></div>
            )}
            <Modal
                isOpen={isOpenModalFindPhone}
                isClose={true}
                onClose={() => setIsOpenModalFindPhone(false)}
                title="Найти по номеру"
              >
                <form className="max__modal-form">
                    <input
                      type="tel"
                      className="max__modal-input"
                      placeholder="7xxxxxxxxxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <button
                        type="button"
                        className="max__modal-button"
                        disabled={!phone.length}
                        onClick={createChat}
                    >
                      Найти в MAX
                    </button>
                  </form>
            </Modal>
        </div>
    );
}