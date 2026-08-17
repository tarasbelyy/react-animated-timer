import { useState, useRef } from "react";
import "./styles.css";

const Timer = () => {

  const [time, setTime] = useState(0);
  const [timeShow, setTimeShow] = useState("00:00");
  const timerRef = useRef(null);
  const secondsRef = useRef(0);
  const offsetRef = useRef(0);

  const circleLength = 2*Math.PI*90;
  const strokeDasharray = `${circleLength}px ${circleLength}px`;

  const showProgress = () => {
    let secondsShow = secondsRef.current % 60;
    let minutesShow = Math.floor(secondsRef.current / 60); 
    secondsShow = (secondsShow < 10) ? "0"+secondsShow.toString() : secondsShow.toString();
    minutesShow = (minutesShow < 10) ? "0"+minutesShow.toString() : minutesShow.toString();
    if (!timerRef.current) {
      offsetRef.current = 0;
    } else {
      offsetRef.current = circleLength * (1 - (secondsRef.current/(time*60)));
    }
    setTimeShow(()=>`${minutesShow}:${secondsShow}`);
  }

  const handleChange = (event) => {
    if (timerRef.current) return;
    let newValue = event.target.value;
    if (newValue.toString().indexOf(".") !== -1) {
      newValue = newValue.toString().split(".")[0];
    }
    if (newValue.toString().indexOf(",") !== -1) {
      newValue = newValue.toString().split(",")[0];
    }
    if (newValue < 0) newValue = 0;
    if (newValue > 99) newValue = 99;
    secondsRef.current = newValue * 60;
    offsetRef.current = 0;
    setTime(() => newValue);
    showProgress();
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    secondsRef.current = time * 60;
    offsetRef.current = 0;
    showProgress();
  };

  const startTimer = () => {
    if (timerRef.current) return;
    if (secondsRef.current === 0) return;
    timerRef.current = setInterval(() => {
      secondsRef.current--;
      showProgress();
      if (secondsRef.current === 0){
        resetTimer();
        setTimeout(() => alert("Таймер закончился!"), 50);
      }
    },1000);
  };

  const restartTimer = () => {
    if (!timerRef.current) return;
    clearInterval(timerRef.current);
    timerRef.current = null;
    secondsRef.current = time*60;
    showProgress();
    startTimer();
  };

  return (
    <div className="timer-container">
      <div className="input-container">
      <h2>Таймер</h2>
      <input
        type="number"
        value={time}
        onChange={handleChange}
        disabled={timerRef.current}
        style={{ backgroundColor : (timerRef.current) ? "lightgray" : "white" }}
      >
      </input>
      </div>
      <div className="button-container">
        <button
          onClick={startTimer}
          disabled={timerRef.current}
          style={{ backgroundColor : (timerRef.current) ? "gray" : "lightgray" }}
        >Старт</button>
        <button
          onClick={resetTimer}
          disabled={!timerRef.current}
          style={{ backgroundColor : (!timerRef.current) ? "gray" : "lightgray" }}
        >Сброс</button>
        <button
          onClick={restartTimer}
          disabled={!timerRef.current}
          style={{ backgroundColor : (!timerRef.current) ? "gray" : "lightgray" }}
        >Заново</button>
      </div>
      <div className="svg-container">
        <svg className="svg" width="200" height="200" viewBox="0 0 200 200">
          <circle className="background-circle" cx="100" cy="100" r="90" />
          <circle className="progress-circle" cx="100" cy="100" r="90" stroke-dasharray={strokeDasharray} stroke-dashoffset={`${offsetRef.current}px`}/>
          <text className="progress-text" x="100" y="100" >{timeShow}</text>
        </svg>
      </div>
    </div>
  );
};

export default Timer;