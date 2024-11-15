// Clock constructor initializes with format (12-hour or 24-hour) and time zone (UTC by default)
function Clock(format = "12-hour", timeZone = "UTC") {
  this.format = format; // Set the time format (12-hour or 24-hour)
  this.timeZone = timeZone; // Set the time zone (UTC by default)
  this.updateTime(); // Update the current time
}

// Method to update the time based on the current time and selected time zone
Clock.prototype.updateTime = function () {
  const date = new Date(); // Get the current date and time
  this.hours = date
    .toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: this.format === "12-hour", // Set 12-hour or 24-hour format
      timeZone: this.timeZone, // Apply the selected time zone
    })
    .split(":")[0]; // Extract the hour part

  this.minutes = date.getMinutes(); // Get the minutes
  this.seconds = date.getSeconds(); // Get the seconds
};

// Method to return the formatted time as per the selected format (12-hour or 24-hour)
Clock.prototype.getFormattedTime = function () {
  if (this.format === "12-hour") {
    const hours12 = this.hours % 12 || 12; // Convert to 12-hour format
    return `${String(hours12).padStart(2, "0")}:${String(this.minutes).padStart(
      2,
      "0"
    )}:${String(this.seconds).padStart(2, "0")}`;
  } else {
    return `${String(this.hours).padStart(2, "0")}:${String(
      this.minutes
    ).padStart(2, "0")}:${String(this.seconds).padStart(2, "0")}`;
  }
};

// Method to get the AM/PM period for 12-hour format
Clock.prototype.get12HourTime = function () {
  if (this.format === "12-hour") {
    const period = this.hours >= 12 ? "PM" : "AM"; // Determine AM or PM
    return `${period}`;
  } else {
    return "";
  }
};

// Start the clock, update time every second, and handle format and time zone changes
function startClock() {
  const clock = new Clock(); // Initialize the clock
  const clockContainer = document.getElementById("clock-container"); // Get the clock display element
  const toggleButton = document.getElementById("toggle-format"); // Get the toggle format button
  const timeZoneSelect = document.getElementById("timezone-select"); // Get the time zone selector
  const alarmTimeInput = document.getElementById("alarm"); // Get the alarm input field
  const setAlarmButton = document.getElementById("set-alarm"); // Get the set alarm button

  // Function to render the clock with updated time
  const renderClock = () => {
    clock.updateTime(); // Update the time
    const formattedTime = `${clock.getFormattedTime()} ${clock.get12HourTime()}`; // Get formatted time
    clockContainer.innerHTML = formattedTime; // Display the formatted time

    // Allow the user to change the clock text color
    const color = document.getElementById("color");
    color.addEventListener("input", (event) => {
      const selectedColor = event.target.value; // Get selected color
      clockContainer.style.color = selectedColor; // Apply selected color to clock
    });
  };

  setInterval(renderClock, 1000); // Update the clock every second

  // Toggle between 12-hour and 24-hour format when the button is clicked
  toggleButton.addEventListener("click", () => {
    clock.format = clock.format === "12-hour" ? "24-hour" : "12-hour"; // Switch format
    toggleButton.textContent =
      clock.format === "12-hour"
        ? "Switch to 24-Hour Format"
        : "Switch to 12-Hour Format"; // Update button text
    renderClock(); // Re-render the clock with the new format
  });

  // Change the time zone when a new time zone is selected
  timeZoneSelect.addEventListener("change", (event) => {
    clock.timeZone = event.target.value; // Set the new time zone
    renderClock(); // Re-render the clock with the new time zone
  });

  // Set an alarm when the button is clicked
  setAlarmButton.addEventListener("click", () => {
    const alarmTime = alarmTimeInput.value; // Get the selected alarm time

    if (!alarmTime) return alert("Please select a valid time for the alarm."); // Alert if no time is selected

    const [hours, minutes] = alarmTime.split(":").map(Number); // Extract hours and minutes
    const now = new Date(); // Get the current date and time
    const alarmDate = new Date(now); // Create a new date object for the alarm
    alarmDate.setHours(hours, minutes, 0, 0); // Set alarm time

    if (alarmDate <= now) alarmDate.setDate(now.getDate() + 1); // Set alarm for the next day if the time is in the past

    setTimeout(() => alert("Time's up! Alarm triggered!"), alarmDate - now); // Trigger alarm at the set time
    alert(`Alarm set for ${alarmDate.toLocaleTimeString()}`); // Display alarm set confirmation
  });

  renderClock(); // Render the clock immediately when the page loads
}

startClock(); // Start the clock
