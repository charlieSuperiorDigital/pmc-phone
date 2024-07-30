import { useEffect, useState } from "react";
import { Device } from "@twilio/voice-sdk";

//Types
enum USER_STATE {
  CONNECTING = "Connecting",
  READY = "Ready",
  ON_CALL = "On call",
  OFFLINE = "Offline",
}

const numberList = [1, 2, 3, 4, 5, 6, 7, 8, 9, "+", 0, "<<"];

const stateColor = {
  [USER_STATE.CONNECTING]: "#B7AC44",
  [USER_STATE.READY]: "#DAD870",
  [USER_STATE.ON_CALL]: "#FF5C4D",
  [USER_STATE.OFFLINE]: "#FFB52E",
};

//Helpers
const Timer = () => {
  const [timer, setTimer] = useState({ mins: 0, sec: 0 });
  const getTime = () => {
    setTimer((state) => ({
      mins: state.sec === 60 ? state.mins + 1 : state.mins,
      sec: state.sec === 60 ? 0 : state.sec + 1,
    }));
  };
  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer">
      {`${timer.mins < 9 ? "0" + timer.mins : timer.mins} : ${
        timer.sec < 9 ? "0" + timer.sec : timer.sec
      }`}
    </div>
  );
};

//Components
const Phone = ({ token }: { token: string }) => {
  //State
  const [userState, setUserState] = useState(USER_STATE.OFFLINE);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [connection, setConnection] = useState(null);
  const [callDevice, setDevice] = useState<undefined | Device>();

  //Callback
  useEffect(() => {
    init();
  }, [token]);

  //Helpers
  const init = async () => {
    if (token) {
      try {
        console.log("Token connected successfully!!", token);
        const device = new Device(token, {
          logLevel: 1,
          edge: "ashburn",
        });
        device.register();
        setDevice(device);
        (device as any).addListener("connect", (device: any) => {
          console.log("Connect event listener added .....");
          return device;
        });
        (device as any).on("registered", () => {
          console.log("Agent registered");
          setUserState(USER_STATE.READY);
        });
        (device as any).on("connect", (connection) => {
          console.log("Call connect");
          setConnection(connection);
          setUserState(USER_STATE.ON_CALL);
        });
        (device as any).on("disconnect", () => {
          console.log("Disconnect event");
          setUserState(USER_STATE.READY);
          setConnection(null);
        });

        return () => {
          device.destroy();
          setDevice(undefined);
          setUserState(USER_STATE.OFFLINE);
        };
      } catch (error) {
        console.log("Error", error);
      }
    }
  };

  const handleCall = async () => {
    const params: Record<string, string> = {
      From: `${import.meta.env.VITE_USER_ID}`,
      To: phoneNumber,
      projectId: `${import.meta.env.VITE_PROJECT_ID}`,
    };
    (callDevice as any)?.emit("connect");
    callDevice
      ?.connect({
        params: params,
        rtcConstraints: {
          audio: true,
        },
      })
      .then((call) => {
        (call as any).on("accept", () => {
          setConnection(connection);
          setUserState(USER_STATE.ON_CALL);
          console.log("call accepted");
        });
        (call as any).on("disconnect", () => {
          console.log("The call has been disconnected.");
          setUserState(USER_STATE.READY);
          setConnection(null);
        });
        (call as any).on("reject", () => {
          console.log("The call was rejected.");
        });
      });
  };

  //Render Element
  return (
    <div className="phone">
      <div className="user-state">
        <i style={{ color: stateColor[userState] }} className="fas fa-stop"></i>{" "}
        {`Status - > ${userState}`}
      </div>
      <input
        className="number-input"
        value={phoneNumber}
        onChange={(event) => setPhoneNumber(event.target.value)}
      />
      {userState === USER_STATE.ON_CALL ? (
        <Timer />
      ) : (
        <div className="gird">
          {numberList.map((value) => (
            <div
              key={value}
              className="number"
              onClick={() => {
                if (value === "<<") {
                  setPhoneNumber(
                    phoneNumber.substring(0, phoneNumber.length - 1)
                  );
                } else {
                  setPhoneNumber(phoneNumber + value);
                }
              }}
            >
              {value}
            </div>
          ))}
        </div>
      )}
      <div
        className={`${
          userState === USER_STATE.ON_CALL ? "in-call" : "call"
        } button`}
        onClick={() => handleCall()}
      >
        {userState === USER_STATE.ON_CALL ? (
          <i className="material-icons">call_end</i>
        ) : (
          <i className="material-icons">call</i>
        )}
      </div>
    </div>
  );
};

export default Phone;
