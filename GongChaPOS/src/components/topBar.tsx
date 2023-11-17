import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import "./components.css";

/**
 * Renders the top bar component with a back button, title and current time.
 * @returns JSX element
 */
interface TopBarProps {
  isBackButtonVisible: boolean;
  view: string;
  series: String;
  onBackClick: () => void;
}
function TopBar({
  isBackButtonVisible,
  view,
  series,
  onBackClick,
}: TopBarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString();

  return (
    <div className="topNavBar">
      {isBackButtonVisible && (
        <button className="back-button" onClick={onBackClick}>
          <FontAwesomeIcon icon={faArrowLeftLong} className="Back-icon" />
        </button>
      )}
      {!isBackButtonVisible && (
        <div style={{ marginLeft: "85px", marginBottom: "66px" }}></div>
      )}
      <span>{series || "Bubble Tea"} Series</span>
      <div className="topBarInfo">
        <span className="topbarText">
          <FontAwesomeIcon icon={faCheck} className="checkIcon" />
          {view}
        </span>
        <span className="topbarText">
          <FontAwesomeIcon icon={faCheck} className="checkIcon" />
          Printer
        </span>
        <span className="topbarText">
          <FontAwesomeIcon icon={faCheck} className="checkIcon" />
          Customer Display
        </span>
        <span className="topbarText">{formattedTime}</span>
      </div>
    </div>
  );
}

export default TopBar;
