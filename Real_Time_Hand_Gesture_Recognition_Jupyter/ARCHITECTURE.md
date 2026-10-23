# Architecture overview

```text
Browser webcam (getUserMedia)
          |
          v
Sample JPEG frame every ~650 ms
          |
          v
Flask POST /predict
          |
          v
OpenCV decode + BGR-to-RGB conversion
          |
          v
MediaPipe Gesture Recognizer pretrained task model
          |
          v
Gesture label + confidence + detected hands (JSON)
          |
          v
Browser result panel + confidence meter
```

The webcam stream is not saved to disk by this application. Frame images are sent to the local Flask server running on the same computer.
