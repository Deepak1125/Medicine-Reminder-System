document.addEventListener("DOMContentLoaded", () => {
  const alarmForm = document.getElementById("alarmForm");
  const alarmList = document.getElementById("alarms");
  const notificationList = document.getElementById("notifications");
  const clearNotificationsBtn = document.getElementById("Clear");
  let alarmIntervalId = null;

  function displayAlarms() {
    const alarms = JSON.parse(localStorage.getItem("medicationAlarms")) || [];
    alarmList.innerHTML = "";

    alarms.forEach((alarm, index) => {
      const listItem = document.createElement("li");
      listItem.textContent = `${alarm.medicineName} at ${alarm.alarmTime}`;

      // Create the toggle switch
      const toggleSwitch = document.createElement("input");
      toggleSwitch.type = "checkbox";
      toggleSwitch.checked = alarm.active || false;
      toggleSwitch.addEventListener("change", () => toggleAlarm(index));

      // Create the trash icon
      const deleteIcon = document.createElement("i");
      deleteIcon.className = "fas fa-trash"; // Font Awesome trash icon class
      deleteIcon.style.cursor = "pointer"; // Make the icon clickable
      deleteIcon.addEventListener("click", () => deleteAlarm(index)); // Attach delete function

      // Append the toggle switch and delete icon to the list item
      listItem.appendChild(toggleSwitch);
      listItem.appendChild(deleteIcon);

      // Append the list item to the alarms list
      alarmList.appendChild(listItem);
    });
  }

  // Function to add an alarm
  function addAlarm(medicineName, alarmTime) {
    const alarms = JSON.parse(localStorage.getItem("medicationAlarms")) || [];
    alarms.push({ medicineName, alarmTime, active: true });
    localStorage.setItem("medicationAlarms", JSON.stringify(alarms));

    // Set the alarm for this medicine
    setAlarm(medicineName, alarmTime);
    displayAlarms();
  }
  function deleteAlarm(index) {
    const alarms = JSON.parse(localStorage.getItem("medicationAlarms")) || [];
    alarms.splice(index, 1);
    stopAlarm();
    localStorage.setItem("medicationAlarms", JSON.stringify(alarms));
    displayAlarms();
  }
  function toggleAlarm(index) {
  const alarms = JSON.parse(localStorage.getItem("medicationAlarms")) || [];
  const alarm = alarms[index];
  alarm.active = !alarm.active;

  const now = new Date();
  const [hours, minutes] = alarm.alarmTime.split(":").map(Number);
  const alarmTime = new Date();
  alarmTime.setHours(hours, minutes, 0, 0);

  const isAlarmTimeReached = now >= alarmTime;

  if (alarm.active) {
    alarm.notified = false; // reset notification flag
    setAlarm(alarm.medicineName, alarm.alarmTime);
  } else {
    stopAlarm();

    // Show notification only once and only after alarm time
    if (isAlarmTimeReached && !alarm.notified) {
      showNotification(alarm.medicineName);
      alarm.notified = true;
    }
  }

  localStorage.setItem("medicationAlarms", JSON.stringify(alarms));
  displayAlarms();
}

  alarmForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const medicineName = document.getElementById("medicineName").value.trim();
    const alarmTime = document.getElementById("alarmTime").value;
    if (medicineName && alarmTime) {
      addAlarm(medicineName, alarmTime);
      alarmForm.reset();
    }
  });

  // Function to play a sound when the alarm goes off
  function playAlarmSound() {
    const audio = new Audio("Alarm_sound.mp3");
    audio.play();
  }
  function showPopupNotification(medicineName) {
    const popup = document.createElement("div");
    popup.className = "popup-notification";
    popup.textContent = `Time to take ${medicineName}`;

    // Append the popup to the body
    document.body.appendChild(popup);

    // Remove the popup after 5 seconds
    setTimeout(() => {
      popup.remove();
    }, 5000); // Popup disappears after 5 seconds
  }

  function playAlarmSoundRepeatedly() {
    if (alarmIntervalId) {
      clearInterval(alarmIntervalId);
    }
    alarmIntervalId = setInterval(() => {
      playAlarmSound();
    }, 700);
  }

  // Function to stop the alarm
  function stopAlarm() {
  if (alarmIntervalId) {
    clearInterval(alarmIntervalId);
    alarmIntervalId = null;
  }
}

  function setAlarm(medicineName, alarmTime) {
  const now = new Date();
  const alarmDate = new Date();
  const [hours, minutes] = alarmTime.split(":").map(Number);
  alarmDate.setHours(hours, minutes, 0, 0);

  const timeToAlarm = alarmDate.getTime() - now.getTime();
  console.log(timeToAlarm);

  if (timeToAlarm > 0) {
    if (alarmIntervalId) {
      clearInterval(alarmIntervalId);
      alarmIntervalId = null;
    }

    setTimeout(() => {
      playAlarmSoundRepeatedly();
      showPopupNotification(medicineName);

      // Stop alarm and show notification after 10 seconds
      setTimeout(() => {
        stopAlarm(medicineName); // this now includes showNotification
      }, 3000);
    }, timeToAlarm);
  }
}


  // Load and display notifications from localStorage
  function displayNotifications() {
    const notifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    notificationList.innerHTML = ""; // Clear existing notifications

    notifications.forEach((notification) => {
      const notify = document.createElement("li");
      notify.textContent = notification;
      notificationList.appendChild(notify);
    });
  }

  // Function to show and save notifications in localStorage
  function showNotification(medicineName) {
    const currentTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const notificationText = `Time to take ${medicineName}--${currentTime}`;

    // Save to localStorage
    const notifications =
      JSON.parse(localStorage.getItem("notifications")) || [];
    notifications.push(notificationText);
    localStorage.setItem("notifications", JSON.stringify(notifications));

    // Add notification to the list
    const notify = document.createElement("li");
    notify.textContent = notificationText;
    notificationList.appendChild(notify);
  }

  // Clear notifications button event
  clearNotificationsBtn.addEventListener("click", () => {
    notificationList.innerHTML = "";
    localStorage.removeItem("notifications");
  });
  displayAlarms();
  displayNotifications();
});
const medicines = [
  "Paracetamol",
  "Ibuprofen",
  "Amoxicillin",
  "Metformin",
  "Lisinopril",
  "Atorvastatin",
  "Cetirizine",
  "Omeprazole",
  "Levothyroxine",
  "Aspirin",
  "Simvastatin",
  "Furosemide",
  "Azithromycin",
  "Warfarin",
  "Loratadine",
  "Doxycycline",
  "Metoprolol",
  "Prednisone",
  "Hydrochlorothiazide",
  "Ranitidine",
  "Calciferol",
  "Cyanocobalamin",
  "Feosol",
  "Caltrate",
  "Folic Acid",
  "Ester-C",
  "Mag-Ox",
  "Cold-Eeze",
  "Retinol",
  "Tocopherol",
  "K-Dur",
  "Pyridoxine",
  "Copper Gluconate",
  "Manganese Gluconate",
  "Biotin",
];

function filterMedicines() {
  const input = document.getElementById("searchMedicine").value.toLowerCase();
  const suggestionsList = document.getElementById("suggestions");
  suggestionsList.innerHTML = "";
  if (input === "") {
    return;
  }
  const filteredMedicines = medicines.filter((medicine) =>
    medicine.toLowerCase().startsWith(input)
  );

  filteredMedicines.forEach((medicine) => {
    const listItem = document.createElement("li");
    listItem.textContent = medicine;
    listItem.onclick = () => selectMedicine(medicine);
    suggestionsList.appendChild(listItem);
  });
}

function selectMedicine(medicine) {
  document.getElementById("searchMedicine").value = medicine;
  document.getElementById("suggestions").innerHTML = "";
}

// medicine.js
async function searchMedicine() {
  const medicineName = document.getElementById("searchMedicine").value.trim();

  if (!medicineName) {
    alert("Please enter a medicine name.");
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:3000/medicine?name=${encodeURIComponent(medicineName)}`
    );

    const data = await response.json();

    if (response.status === 404) {
      document.getElementById("medicineInfo").innerHTML = "Medicine not found.";
      return;
    }

    if (!data || Object.keys(data).length === 0) {
      document.getElementById("medicineInfo").innerHTML = "No data available.";
      return;
    }

    displayMedicineInfo(data);
  } catch (error) {
    console.error("Error fetching medicine data:", error);
    document.getElementById("medicineInfo").innerHTML =
      "Error fetching medicine data.";
  }
}


function displayMedicineInfo(data) {
  const infoDiv = document.getElementById("medicineInfo");
  infoDiv.innerHTML = `
        <h3>${data["Medicine Name"]}</h3>
        <p><strong>Uses:</strong> ${data["Uses"]}</p>
        <p><strong>When to Take:</strong> ${data["When to Take"]}</p>
        <p><strong>Food Considerations:</strong> ${data["Food Considerations"]}</p>
    `;
}
