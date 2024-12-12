// ********************************Manual********************************


// document.getElementById("predict-button").addEventListener("click", async () => {
//     const temperature = document.getElementById("temperature").value;
//     const humidity = document.getElementById("humidity").value;
//     const ph = document.getElementById("ph").value;

//     if (!temperature || !humidity || !ph) {
//         alert("Please fill all the fields.");
//         return;
//     }

//     try {
//         const response = await fetch("http://127.0.0.1:5000/predict", {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ temperature, humidity, ph })
//         });

//         const result = await response.json();

//         if (response.ok) {
//             // Display the predicted crop name
//             document.getElementById("crop-name").textContent = result.predicted_crop;

//             // Display crop details
//             const details = result.crop_details;
//             if (details) {
//                 document.getElementById("crop-details").textContent = `
//                     Water Requirement: ${details.water_requirement}, Growth Time: ${details.growth_time}
//                 `;

//                 // Inject the image dynamically
//                 const cropImage = document.getElementById("crop-image");
//                 cropImage.src = details.image; // Set the image source dynamically
//                 cropImage.alt = `Image of ${result.predicted_crop}`; // Set the alt text for accessibility
//                 cropImage.style.display = "block"; // Ensure the image is displayed
//             } else {
//                 // Hide the image if no details are available
//                 document.getElementById("crop-image").style.display = "none";
//             }
//         } else {
//             alert(result.error || "An error occurred while predicting the crop.");
//         }
//     } catch (error) {
//         alert("Failed to connect to the backend: " + error.message);
//     }
// });







// ********************************API********************************
import { database, ref, get } from "./firebaseauth.js";

document.getElementById("fetch-button").addEventListener("click", async () => {
    try {
        // Fetch data from Firebase
        const dbRef = ref(database);
        const snapshot = await get(dbRef);
        if (!snapshot.exists()) {
            alert("No sensor data found in Firebase!");
            return;
        }

        const data = snapshot.val();

        // Populate input fields with sensor data
        document.getElementById("temperature").value = data.temperature || "";
        document.getElementById("humidity").value = data.humidity || "";
        document.getElementById("ph").value = data.ph || "";
        document.getElementById("moisture").value = data.moisture || "";

        alert("Sensor data fetched successfully!");
    } catch (error) {
        alert("Failed to fetch sensor data: " + error.message);
        console.error(error);
    }
});

document.getElementById("predict-button").addEventListener("click", async () => {
    const temperature = document.getElementById("temperature").value;
    const humidity = document.getElementById("humidity").value;
    const ph = document.getElementById("ph").value;
    const moisture = document.getElementById("moisture").value;

    if (!temperature || !humidity || !ph || !moisture) {
        alert("Please fetch or fill all the fields.");
        return;
    }

    try {
        // Send fetched data to the backend for prediction
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ temperature, humidity, ph, moisture }),
        });

        const result = await response.json();

        if (response.ok) {
            // Display the predicted crop and details
            document.getElementById("crop-name").textContent = result.predicted_crop || "No crop found!";
            const details = result.crop_details;
            if (details) {
                document.getElementById("crop-details").textContent = `
                    Water Requirement: ${details.water_requirement}, Growth Time: ${details.growth_time}
                `;
                const cropImage = document.getElementById("crop-image");
                cropImage.src = details.image;
                cropImage.alt = `Image of ${result.predicted_crop}`;
                cropImage.style.display = "block";
            } else {
                document.getElementById("crop-details").textContent = "No additional details found.";
                document.getElementById("crop-image").style.display = "none";
            }
        } else {
            alert(result.error || "An error occurred while predicting the crop.");
        }
    } catch (error) {
        alert("Failed to connect to the backend: " + error.message);
        console.error(error);
    }
});









// // ********************************API & Manual********************************
// // Function to fetch default values from an API or a mock endpoint
// import { database, ref, get } from "./firebaseauth.js";
// // Function to fetch default values
// async function fetchData() {
//     try {
//         // Replace this with your actual data-fetching API URL or mock endpoint
//         const response = await fetch("http://127.0.0.1:5000/fetch-data");
//         if (!response.ok) throw new Error("Failed to fetch default values.");

//         const data = await response.json();

//         // Populate input fields with fetched data
//         document.getElementById("temperature").value = data.temperature || "";
//         document.getElementById("humidity").value = data.humidity || "";
//         document.getElementById("moisture").value = data.moisture || "";
//         document.getElementById("ph").value = data.ph || "";

//         alert("Data fetched successfully!");
//     } catch (error) {
//         console.error("Error fetching data:", error);
//         alert("Failed to fetch data. Please check your connection or server.");
//     }
// }

// // Function to send user inputs to the trained model and get a recommendation
// async function recommendCrop() {
//     // Collect user inputs
//     const temperature = parseFloat(document.getElementById("temperature").value);
//     const humidity = parseFloat(document.getElementById("humidity").value);
//     const moisture = parseFloat(document.getElementById("moisture").value);
//     const ph = parseFloat(document.getElementById("ph").value);

//     // Validate inputs
//     if (isNaN(temperature) || isNaN(humidity) || isNaN(moisture) || isNaN(ph)) {
//         alert("Please provide valid values in all fields.");
//         return;
//     }

//     try {
//         // Replace this with your trained model's backend API URL
//         const response = await fetch("http://127.0.0.1:5000/predict", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ temperature, humidity, moisture, ph }),
//         });

//         if (!response.ok) throw new Error("Failed to get crop recommendation.");

//         const result = await response.json();

//         // Display the recommended crop and details
//         document.getElementById("crop-name").textContent = result.cropName || "No recommendation";
//         document.getElementById("crop-details").textContent = result.details || "Details unavailable.";
//         const cropImage = document.getElementById("crop-image");
//         if (result.image) {
//             cropImage.src = result.image;
//             cropImage.style.display = "block";
//         } else {
//             cropImage.style.display = "none";
//         }
//     } catch (error) {
//         console.error("Error in crop recommendation:", error);
//         alert("Failed to get a recommendation. Please check your connection or server.");
//     }
// }

// // Add event listeners to the buttons
// document.getElementById("fetch-button").addEventListener("click", fetchData);
// document.getElementById("predict-button").addEventListener("click", recommendCrop);
