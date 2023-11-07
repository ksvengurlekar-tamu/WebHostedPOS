import React, { useState, useEffect } from 'react';
import './TopBar.css';

/**
 * Renders the top bar component with a back button, title and current time.
 * @returns JSX element
 */
function TopBar() {
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
    <div className="top-bar">
      <button className="back-button">Back</button>
      {/* TODO: update top-bar-title to reflect tea series selected */}
      <span className="top-bar-title">Bubble Tea Series</span>
      <span className="top-bar-time">{formattedTime}</span>
    </div>
  );
}

export default TopBar