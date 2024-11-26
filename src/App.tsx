import { useState } from "react";
import "./App.css";
import Phone from "./Phone";
import { getToken } from "./services";
import Chat from "./Chat";
import ChatEmergency from "./chat-emergency";
import ChatEmergencyProvider from "./chat-emergency-provider";
import ChatEmergencyProject from "./chat-emeregency-project";

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
            <p>Emergency Chat Client </p>
            <ChatEmergency />
            <p>Emergency Chat Provider</p>
            <ChatEmergencyProvider />
          </div>
          <p>Emergency Chat Project </p>
          <div style={{ display: "flex", gap: 100 }}>
            <ChatEmergencyProject name="TESTER CLIENT" />
            <ChatEmergencyProject name="TESTER PROVIDER" />
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
