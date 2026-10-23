# GestureAI — Jupyter Notebook Setup

## Recommended
1. Extract the ZIP.
2. Open Jupyter Notebook / JupyterLab with this folder as the working directory.
3. Open `GestureAI_Jupyter.ipynb`.
4. Run cells from top to bottom.
5. Open `http://127.0.0.1:5000` in Chrome/Edge.
6. Allow webcam access and click **Start camera**.

Keep the notebook kernel running while the app is in use. The app runs as a local Flask process started by the notebook. First setup needs internet for pip packages and the pretrained MediaPipe task model.

## If you use Anaconda
Open Anaconda Prompt in the extracted folder and run:
```bash
python -m pip install -r requirements.txt
jupyter notebook
```
Then open `GestureAI_Jupyter.ipynb`.

## If localhost already in use
Stop any previous server using the notebook's stop cell, or change `port=5000` in `app.py` and use the matching URL.

## UI changes
The website has a dark navy interface with mint-green accents, redesigned status badges, a live camera panel, prediction panel, confidence meter, supported-gesture chips, and responsive layout.

## Model caveat
The current application uses MediaPipe's pretrained Gesture Recognizer, not a CNN trained from scratch. If your grading rubric explicitly requires a trained CNN, add a dataset/training notebook and report measured metrics separately.


## Reference-inspired UI refresh
The website now uses a futuristic touchless-controls theme with dark blue technology styling, cyan/purple neon accents, a large camera preview, floating tracking cards, a live gesture console, and a responsive layout inspired by the supplied visual reference.
