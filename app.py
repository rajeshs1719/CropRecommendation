from flask import Flask, request, jsonify, send_from_directory
import joblib
import pandas as pd
import json

app = Flask(__name__)

try:
    # Load the trained model
    model = joblib.load("crop_recommendation_model.pkl")
    print("Model loaded successfully.")

    # Load crop details
    with open("crop_details.json", "r") as file:
        crop_details = json.load(file)
    print("Crop details loaded successfully.")
except Exception as e:
    print(f"Error: {e}")

# Label to crop mapping (as per LabelEncoder used during training)
LABEL_TO_CROP = {
    0: "Rice",
    1: "Maize",
    2: "Chickpea",
    3: "Kidneybeans",
    4: "Pigeonpeas",
    5: "Mothbeans",
    6: "Mungbean",
    7: "Blackgram",
    8: "Lentil",
    9: "Watermelon",
    10: "Muskmelon",
    11: "Cotton",
    12: "Jute",
}

@app.route("/")
def serve_index():
    """Serve the frontend index.html file."""
    return send_from_directory(".", "index.html")

@app.route("/<path:path>")
def serve_static_files(path):
    """Serve static files like CSS, JS, and images."""
    return send_from_directory(".", path)

@app.route("/predict", methods=["POST"])
def predict():
    """Predict the crop based on user input."""
    try:
        # Get data from the request
        data = request.json
        temperature = float(data.get("temperature"))
        humidity = float(data.get("humidity"))
        ph = float(data.get("ph"))
        moisture = float(data.get("moisture"))  # Adding moisture

        # Prepare input for the model
        input_data = pd.DataFrame([[temperature, humidity, ph, moisture]],
                                  columns=["temperature", "humidity", "ph", "water availability"])

        # Predict the crop
        prediction = model.predict(input_data)[0]  # Model returns the label (integer)
        predicted_crop = LABEL_TO_CROP.get(prediction, "Unknown Crop")

        # Fetch crop details
        crop_info = crop_details.get(predicted_crop, {})
        return jsonify({"predicted_crop": predicted_crop, "crop_details": crop_info})

    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
