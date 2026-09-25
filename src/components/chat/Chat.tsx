import { useEffect, useRef, useState } from 'react';
import { IMessage } from '../../interfaces/message.interface';
import './Chat.scss';
import EmptyChat from './empty/Empty-chat';
import { API_URL } from '../../constants/fetch.constants';

export default function Chat({ credentials, phone }) {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [messageValue, setMessageValue] = useState<string>('');

    useEffect(() => {
        if (!messageValue) return;

        const handleEsc = (e) => {
          if (e.key === 'Enter') sendMessage();
        };
        document.addEventListener('keydown', handleEsc);

        return () => document.removeEventListener('keydown', handleEsc);
    }, [messageValue]);

    async function sendMessage() {
        const message = messageValue.trim();
        const tempId = Date.now();

        setMessageValue(message);

        const newMessage: IMessage = {
            id: Date.now(),
            status: 'send',
            text: message,
            time: `${new Date().getHours()}:${new Date().getMinutes()}`,
        };
        
        setMessages((prev) => [...prev, newMessage]);
        setMessageValue('');

        try {
            const result = await sendMessageToGreenApi(message);

            setMessages((prev) => prev.map((m) => m.id === newMessage.id
                ? { ...m, status: 'send', id: result.idMessage}
                : m
            ));
        } catch (err) {
            setMessages((prev) =>
                prev.map((m) =>
                  m.id === tempId ? { ...m, status: 'error' } : m
                )
              );
        }
    }

    const isPollingRef = useRef(false);

    useEffect(() => {
      if (!credentials.idInstance || !credentials.apiTokenInstance) return;

      isPollingRef.current = true;
      const abortController = new AbortController();

      const startReceiving = async () => {
        const { idInstance, apiTokenInstance } = credentials;

        while (isPollingRef.current && !abortController.signal.aborted) {
          try {
            const receiveUrl = `${API_URL}/waInstance${idInstance}/receiveNotification/${apiTokenInstance}?receiveTimeout=5`;
            const response = await fetch(receiveUrl, { signal: abortController.signal });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const contentType = response.headers.get('content-type');
            let data = null;
            if (contentType && contentType.includes('application/json')) {
              data = await response.json();
            }

            if (data && data.receiptId) {
              const body = data.body;

              if (body?.messageData?.typeMessage === 'textMessage') {
                const text = body.messageData.textMessageData.textMessage;
                
                const incomingMessage: IMessage = {
                  id: Date.now(),
                  status: 'received',
                  text: text,
                  time: `${new Date().getHours()}:${String(new Date().getMinutes()).padStart(2, '0')}`,
                };

                setMessages((prev) => [...prev, incomingMessage]);
              }

              const deleteUrl = `${API_URL}/waInstance${idInstance}/deleteNotification/${apiTokenInstance}/${data.receiptId}`;
              await fetch(deleteUrl, { method: 'DELETE', signal: abortController.signal });
            }
          } catch (error) {
            if (error.name === 'AbortError') break;
            await new Promise((r) => setTimeout(r, 5000));
          }
        }
      };

      startReceiving();

      return () => {
        isPollingRef.current = false;
        abortController.abort();
      };
    }, [credentials.idInstance, credentials.apiTokenInstance]);

    function deleteMessage(messageId: number) {
        const updatedMessages = messages.filter(message => message.id !== messageId);
        setMessages(updatedMessages);
    }

    async function sendMessageToGreenApi(messageText) {
        const { idInstance, apiTokenInstance, chatId } = credentials;
        const url = `${API_URL}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;        

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chatId: chatId,
                    message: messageText
                })
            });
            
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`HTTP ${response.status}: ${error}`);
            }

            const responseData = await response.json();
            return responseData;            
        } catch (error) {
            throw error;
        }
    }
    
    return (
        <div className="chat">
            <div className="chat__header">
                <img className="chat__header-back" src="/arrow-left.svg"/>
                <div className="chat__header-logo"></div>
                <div className="chat__header-user-data">
                    <span className="chat__header-user-name">+ { phone }</span>
                    <span className="chat__header-user-status">Был недавно</span>
                </div>
            </div>
            <div className="chat__field">
                {messages.length === 0
                    ? <EmptyChat/>
                    : (
                        <div className="chat__messages">
                            <ul>
                                {messages.map(message => {
                                    return (
                                        <li key={message.id} className={`message__wrap message__wrap--${message.status}`}>
                                            <button className="message__delete-action"
                                                onClick={() => deleteMessage(message.id)}
                                            >
                                                <img src="/delete.svg" />
                                            </button>
                                            <div className="message">
                                                <p className="message__text">{ message.text }</p>
                                                <p className="message__info">
                                                    <span className="message__time-send">{message.time}</span>
                                                    <span className="message__status-send"></span>
                                                </p>
                                            </div>
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    )
                }

                <div className="chat__input-text">
                    <div className="input-wrap">
                         <input
                            className="input-wrap__input"
                            type="text"
                            placeholder="Сообщение"
                            value={messageValue}
                            onChange={(e) => setMessageValue(e.target.value)}
                        />
                        <button
                            className="input-wrap__action-send"
                            disabled={!messageValue}
                            onClick={sendMessage}
                        >
                            <img src="/arrow-up.svg" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}