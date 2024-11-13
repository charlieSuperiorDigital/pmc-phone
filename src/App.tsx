import { useState } from "react";
import "./App.css";
import Phone from "./Phone";
import { getToken } from "./services";
import Chat from "./Chat";
import ChatEmergency from "./chat-emergency";
import ChatEmergencyProvider from "./chat-emergency-provider";

function App() {
  const [token, setToken] = useState("");

  const init = async () => {
    const token = await getToken("phil");
    console.log({
      token,
    });
    setToken(token);
  };

  return (
    <div className="app">
      <div className="header"> Voice Caller </div>
      {token ? (
        <div className="phone-box">
          <Phone token={token} />
          <Chat />
          <div>
            <p>Emergency Chat</p>
            <ChatEmergency />
            <p>Emergency Chat Provider</p>
            <ChatEmergencyProvider />
          </div>
        </div>
      ) : (
        <div className="connect-button button" onClick={() => init()}>
          Connect
        </div>
      )}
    </div>
  );
}

export default App;
