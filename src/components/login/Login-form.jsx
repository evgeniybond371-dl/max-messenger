import { useState } from 'react';
import './Login-form.css';

export default function LoginForm({onSubmit}) {
    const [idInstance, setIdInstance] = useState('');
    const [apiTokenInstance, setApiTokenInstance] = useState('');

    function sendData() {
      if (idInstance && apiTokenInstance) {
        onSubmit({idInstance, apiTokenInstance, chatId: '', error: ''});
      } else {
        onSubmit({idInstance, apiTokenInstance, error: 'Некорректные данные'});
      }
    }

    return (
        <div className="login">
            <h2 className="login__title">Привет!</h2>

            <form className="login__form">
              <input
                className="login__control"
                type="text"
                value={idInstance}
                onChange={(e) => setIdInstance(e.target.value)}
                placeholder="Ваш idInstance"
              />
              <input
                className="login__control"
                type="text"
                value={apiTokenInstance}
                onChange={(e) => setApiTokenInstance(e.target.value)}
                placeholder="Ваш apiTokenInstance"
              />
            </form>

            <div className="login__submit">
              <button
                type="button"
                className="login__submit-action"
                disabled={!idInstance || !apiTokenInstance}
                onClick={sendData}
              >Отправить</button>
            </div>
        </div>
    );
}
