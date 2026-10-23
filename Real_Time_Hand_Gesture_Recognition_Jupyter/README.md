# GestureAI — Real-Time Hand Gesture Recognition

A local web application that captures webcam frames in the browser and recognizes common hand gestures with MediaPipe's pretrained Gesture Recognizer model. The UI displays the predicted label, confidence score, and detected-hand count.

## Features
- Professional responsive web interface (Flask + HTML/CSS/JavaScript)
- Browser webcam input; no video/audio is recorded or saved by this app
- MediaPipe pretrained gesture recognition model; first run downloads the model file
- Per-frame inference and live confidence visualization
- Health endpoint: `http://127.0.0.1:5000/health`
- Milestone checklist and screenshot evidence folder

## Quick start — Windows 10/11
1. Install Python 3.10 or 3.11 (64-bit) and tick **Add Python to PATH**.
2. Extract this ZIP to a normal folder.
3. Double-click `run_windows.bat`.
4. Wait for dependencies to install. On first launch, the app downloads the model from Google's MediaPipe model storage; internet is required once.
5. Open **http://127.0.0.1:5000** in Chrome or Edge.
6. Click **Start camera** and allow camera permission.
7. To stop, click **Stop** or close the terminal.

If `py` is not recognized, install Python from https://www.python.org/downloads/ and reopen the terminal.

### Manual install
Open Command Prompt in this folder:
```bat
py -m venv .venv
.venv\\Scripts\\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
python app.py
```
Then visit `http://127.0.0.1:5000`.

## Architecture
1. **Input:** Browser `getUserMedia()` captures webcam video.
2. **Pre-processing:** JavaScript samples a frame, mirrors it for a natural selfie view, and sends JPEG data to `/predict`.
3. **Inference:** Flask decodes the frame; OpenCV converts BGR to RGB; MediaPipe Gesture Recognizer detects hand landmarks and classifies gestures using its pretrained model.
4. **Output:** JSON predictions are rendered as gesture label, confidence, and hand count.
5. **Deployment:** Local Flask server bound to `127.0.0.1:5000`.

## Model and labels
The project uses the MediaPipe Gesture Recognizer task model rather than training a new CNN from scratch. It is a pretrained deep-learning vision model packaged as a `.task` asset. Typical built-in labels include `Closed_Fist`, `Open_Palm`, `Pointing_Up`, `Thumb_Down`, `Thumb_Up`, `Victory`, and `ILoveYou`. Actual predictions depend on lighting, hand position, camera quality, and model version. The project does **not** claim to train a custom CNN.

If your competition specifically requires a CNN you train yourself, extend this project with a dataset (e.g. ASL alphabet images), train a TensorFlow/Keras CNN, and report the split and metrics separately. Do not report pretrained-model results as custom training results.

## Evaluation plan
The webcam demo is qualitative and does not by itself establish accuracy. For a defensible evaluation:
- Collect or use a cited labeled dataset with permission to use it.
- Split by participant/person where possible (not just random adjacent frames) into train/validation/test sets.
- Report test accuracy, macro precision, macro recall, macro F1, and a confusion matrix.
- Test varied backgrounds, lighting, camera distances, skin tones, left/right hands, and partial occlusion.
- Record latency (median and 95th percentile) on the actual demo machine.
- Keep test data separate from any tuning.

## Known limitations
- Supports only the gestures built into the pretrained model, not arbitrary signs or full sign-language translation.
- Predictions may be unstable for fast motion, occlusion, low light, or unusual viewpoints.
- Browser camera access generally requires localhost or HTTPS.
- First run requires internet to download the model and packages.
- Confidence is the model's score, not a calibrated probability.
- Local Flask's development server is for demonstrations, not production-scale hosting.
- Dependency compatibility varies by Python version and OS; Python 3.10/3.11 is recommended.

## GitHub setup
```bash
git init
git add .
git commit -m "Build GestureAI real-time gesture recognition demo"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/real-time-hand-gesture-recognition.git
git push -u origin main
```
Create the repository on GitHub first. Do not commit `.venv/` or private data. Add a `.gitignore` before pushing.

## Ten project milestones and evidence
See `MILESTONES.md` and `screenshots/`. The included screenshot is a **sample UI mockup**, not evidence of a real webcam prediction. Capture your own actual running app screenshots for final submission:
1. Project setup / dependencies
2. Model asset downloaded
3. Homepage loaded
4. Camera permission granted
5. Hand visible in camera
6. Gesture predicted
7. Confidence output updated
8. Multiple gesture examples
9. Evaluation results / confusion matrix
10. Final app + GitHub repository

## Sources
- MediaPipe Gesture Recognizer guide: https://ai.google.dev/edge/mediapipe/solutions/vision/gesture_recognizer
- MediaPipe Python setup: https://ai.google.dev/edge/mediapipe/solutions/vision/gesture_recognizer/python
- Model asset: https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task
- Flask documentation: https://flask.palletsprojects.com/
- OpenCV documentation: https://docs.opencv.org/

## Academic integrity
Use this repository as a starting implementation. Understand the pipeline, cite the sources, run it on your own machine, capture real screenshots, and report only results you actually measured. Fill in `CONTRIBUTIONS.md` with each team member's real work.
