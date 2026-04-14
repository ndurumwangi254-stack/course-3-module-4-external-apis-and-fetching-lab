// index.js
const weatherApi = "https://api.weather.gov/alerts/active?area=";

// Get DOM elements
const stateInput = document.getElementById('state-input');
const fetchButton = document.getElementById('fetch-alerts');
const alertsDisplay = document.getElementById('alerts-display');
const errorMessage = document.getElementById('error-message');

// Function to fetch weather alerts
function fetchWeatherAlerts(state) {
  // Validate input: two capital letters
  if (!/^[A-Z]{2}$/.test(state)) {
    displayError('Please enter a valid two-letter state abbreviation.');
    return;
  }

  // Show loading indicator
  showLoading();

  fetch(`${weatherApi}${state}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      displayAlerts(data);
      clearError();
      clearInput();
    })
    .catch(error => {
      console.log(error.message);
      displayError(error.message);
    })
    .finally(() => {
      hideLoading();
    });
}

// Function to display alerts
function displayAlerts(data) {
  const features = data.features || [];
  const numAlerts = features.length;
  const title = data.title || 'Weather Alerts';
  const summary = `${title}: ${numAlerts}`;

  alertsDisplay.innerHTML = `<h2>${summary}</h2>`;

  if (numAlerts > 0) {
    const list = document.createElement('ul');
    features.forEach(alert => {
      const headline = alert.properties.headline;
      const li = document.createElement('li');
      li.textContent = headline;
      list.appendChild(li);
    });
    alertsDisplay.appendChild(list);
  }
}

// Function to display error
function displayError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

// Function to clear error
function clearError() {
  errorMessage.textContent = '';
  errorMessage.classList.add('hidden');
}

// Function to clear input
function clearInput() {
  stateInput.value = '';
}

// Function to show loading
function showLoading() {
  fetchButton.disabled = true;
  fetchButton.textContent = 'Loading...';
}

// Function to hide loading
function hideLoading() {
  fetchButton.disabled = false;
  fetchButton.textContent = 'Get Weather Alerts';
}

// Event listener for button
fetchButton.addEventListener('click', () => {
  const state = stateInput.value.trim().toUpperCase();
  fetchWeatherAlerts(state);
});