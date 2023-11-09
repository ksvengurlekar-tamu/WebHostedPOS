import  { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import './components.css';

/**
 * Renders the top bar component with a back button, title and current time.
 * @returns JSX element
 */
interface TopBarProps {
  isBackButtonVisible: boolean;
  onBackClick: () => void;
}
function TopBar({isBackButtonVisible, onBackClick}: TopBarProps) {
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
      {isBackButtonVisible &&
        <button className="back-button" onClick={onBackClick}><FontAwesomeIcon icon={faArrowLeftLong} className='Back-icon' /></button>}
      {!isBackButtonVisible && <div style={{marginLeft: "85px"}}></div>}
      {/* TODO: update top-bar-title to reflect tea series selected */}
      <span className="top-bar-title">Bubble Tea Series</span>
      <span className="top-bar-time">{formattedTime}</span>
    </div>
  );
}

export default TopBar