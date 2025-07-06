# 🚗 Route Planner Panel

This project provides an interactive **Search Panel** component built with **React**, designed to let users easily configure a route search with optional stops and parking.

## ✨ Features

- 📍 **Origin and Destination Input**  
  Users can input their current location and desired destination.

- 🛑 **Optional Stopovers**  
  Users can choose to add automatic stop suggestions and define the frequency of those stops in kilometers.

- 🅿️ **Optional Parking Search**  
  Users can enable parking search near their destination, specifying a search radius.

- 🔄 **Step-by-Step Interface**  
  The form guides the user through three configuration steps:
  1. Origin and Destination
  2. Stopover Preferences
  3. Parking Preferences

- 🔎 **Geocoding Support**  
  Inputs are converted into geographic coordinates via a `geocodeAddress` utility function.

- 🧠 **Data Validation**  
  Basic validation ensures all required inputs are filled in and logically correct.

- 🌀 **Loading Spinner**  
  When the user submits the final step, a spinner appears with the message "Calculating route..." to indicate the route is being processed.

## 📁 File Structure

