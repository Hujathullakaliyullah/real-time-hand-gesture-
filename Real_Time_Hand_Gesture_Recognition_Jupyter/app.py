from flask import Flask, render_template, request, jsonify
import os, urllib.request, time
import cv2, numpy as np
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

APP_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(APP_DIR, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "gesture_recognizer.task")
MODEL_URL = "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task"

app = Flask(__name__)
recognizer = None
model_error = None

def ensure_model():
    os.makedirs(MODEL_DIR, exist_ok=True)
    if not os.path.exists(MODEL_PATH):
        try:
            urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
        except Exception as exc:
            raise RuntimeError("Could not download the MediaPipe gesture model. Check your internet connection and restart the app. Details: " + str(exc))
    return MODEL_PATH

def get_recognizer():
    global recognizer, model_error
    if recognizer is None:
        model_path = ensure_model()
        options = vision.GestureRecognizerOptions(
            base_options=python.BaseOptions(model_asset_path=model_path),
            running_mode=vision.RunningMode.IMAGE,
            num_hands=2,
            min_hand_detection_confidence=0.45,
            min_hand_presence_confidence=0.45,
            min_tracking_confidence=0.45)
        recognizer = vision.GestureRecognizer.create_from_options(options)
    return recognizer

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/health")
def health():
    return jsonify({"status":"ok","model_ready":os.path.exists(MODEL_PATH),"model":"MediaPipe Gesture Recognizer"})

@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files:
        return jsonify({"error":"No image received"}), 400
    raw = np.frombuffer(request.files["image"].read(), np.uint8)
    frame = cv2.imdecode(raw, cv2.IMREAD_COLOR)
    if frame is None:
        return jsonify({"error":"Invalid image"}), 400
    try:
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb)
        result = get_recognizer().recognize(mp_image)
        gestures=[]
        for hand_idx, hand in enumerate(result.gestures):
            if hand:
                cat=hand[0]
                label=cat.category_name.replace("_"," ").title()
                gestures.append({"label":label,"score":round(float(cat.score),4),"hand":hand_idx+1})
        return jsonify({"gestures":gestures, "hands_detected":len(result.hand_landmarks),
                        "message":"Gesture detected" if gestures else "Show one hand clearly to the camera"})
    except Exception as exc:
        return jsonify({"error":str(exc)}), 500

if __name__ == "__main__":
    print("\\nReal-Time Hand Gesture Recognition")
    print("Open http://127.0.0.1:5000 in your browser. First launch downloads the pretrained model.\\n")
    app.run(host="127.0.0.1", port=5000, debug=False)
