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
  onBackClick?: () => void;
}
function TopBar({ isBackButtonVisible, view, series, onBackClick}: TopBarProps) {
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
  const formattedTimeISO = currentTime.toISOString();

  return (
    <nav className="topNavBar" aria-label="Top Navigation Bar">
      {isBackButtonVisible && (
        <button className="back-button" onClick={onBackClick} aria-label="Go back">
          <FontAwesomeIcon icon={faArrowLeftLong} aria-hidden="true" className="Back-icon" />
        </button>
      )}
      {!isBackButtonVisible && (
        <div style={{ marginLeft: "85px", marginBottom: "66px" }} aria-hidden="true"></div>
      )}
      <h1 className="visually-hidden">{series ? `${series} - Bubble Tea Series` : "Bubble Tea Series"}</h1>
      <span aria-hidden="true">{series || "Bubble Tea Series"}</span>
      <div className="topBarInfo" role="contentinfo">
        <span className="topbarText">
          <FontAwesomeIcon icon={faCheck} aria-hidden="true" className="checkIcon" />
          {view}
        </span>
        <span className="topbarText">
          <FontAwesomeIcon icon={faCheck} aria-hidden="true" className="checkIcon" />
          Printer
        </span>
        <span className="topbarText">
          <FontAwesomeIcon icon={faCheck} aria-hidden="true" className="checkIcon" />
          Customer Display
        </span>
        <time dateTime={formattedTimeISO} className="topbarText">{formattedTime}</time>
      </div>
    </nav>
  );
}

export default TopBar;
