from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from moviepy.editor import AudioFileClip, ImageClip
from PIL import Image
import numpy as np
import io
import os
from datetime import datetime

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

@app.post("/merge")
async def merge_files(imageFile: UploadFile = File(...), audioFile: UploadFile = File(...)):
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    audio_filename = f"temp_audio_{timestamp}.mp3"
    video_filename = f"merged_video_{timestamp}.mp4"

    audio_data = await audioFile.read()
    with open(audio_filename, 'wb') as f:
        f.write(audio_data)

    image_data = await imageFile.read()
    image = Image.open(io.BytesIO(image_data))
    image_np = np.array(image)
    if len(image_np.shape) == 2: 
        image_np = np.stack((image_np,) * 3, axis=-1)
    
    audio_clip = AudioFileClip(audio_filename)
    audio_duration = audio_clip.duration

    image_clip = ImageClip(image_np).set_duration(audio_duration)
    image_clip.fps = 24 

    final_clip = image_clip.set_audio(audio_clip)

    final_clip.write_videofile(f"./{video_filename}", codec="libx264", audio_codec="aac", fps=24)

    with open(video_filename, 'rb') as f:
        video_data = f.read()

    os.remove(audio_filename)
    os.remove(video_filename)

    video_stream = io.BytesIO(video_data)
    video_stream.seek(0)
    
    return StreamingResponse(video_stream, media_type="video/mp4")