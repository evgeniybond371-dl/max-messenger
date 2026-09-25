import { useState } from 'react';
import './App.css';
import LoginForm from './components/login/Login-form';
import Max from './components/max/Max';

export default function App() {
  const [credentials, setCredentials] = useState({
    idInstance: '',
    apiTokenInstance: '',
    chatId: '',
    error: ''
  });

  function updateCredentions(updatedData) {
      setCredentials((prev) => ({...prev, ...updatedData }));
  }

  function handleLogin(loginData) {
    if (loginData) {
      updateCredentions(loginData)
    }
  }

  const isLoggedIn = Boolean(credentials.idInstance && credentials.apiTokenInstance);

  return (
    <div className="main">
      { isLoggedIn ? <Max credentials={credentials} onSendChatId={updateCredentions}/> : <LoginForm onSubmit={handleLogin}/>}
    </div>
  )
}
