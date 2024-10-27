import { PlayCircle, Stop, VideoCameraFrontOutlined } from "@mui/icons-material";
import { Button, IconButton } from "blocksin-system";
import { FabricImage } from "fabric";
import React, { useRef, useState } from "react";

function Video ({canvas, canvasRef}) {
    const [videoSrc, setVideoSrc] = useState(null);
    const [fabricVideo, setFabricVideo] = useState(null);
    const [recordingChunks, setRecordingChunks] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [loadedPercentage, setLoadedPercentage] = useState(0);
    const [uploadmessage, setUploadMessage] = useState("");
    const [recordingTime, setRecordingTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const fileInputRef = useRef(null);
    const videoRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordingIntervalRef = useRef(null);

    const handleVideoUpload = (event) => {
        const file = event.target.files[0];

        if(file) 
        {
            setLoadedPercentage(0);
            setVideoSrc(null);
            setUploadMessage("");

            const url = URL.createObjectURL(file);
            setVideoSrc(url);

            const videoElement = document.createElement("video");
            videoElement.src = url;
            videoElement.crossOrigin = "anonymous";

            videoElement.addEventListener("loadeddata", ()=> {
                const videoWidth = videoElement.videoWidth;
                const videoHeight = videoElement.videoHeight;
                videoElement.width = videoWidth;
                videoElement.height = videoHeight;

                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;

                const scale = Math.min(
                    canvasWidth / videoWidth,
                    canvasHeight / videoHeight
                );

                canvas.renderAll();

                const fabricImage = new FabricImage(videoElement, {
                    left: 0,
                    top: 0,
                    scaleX: scale,
                    scaleY: scale
                });

                setFabricVideo(fabricImage);
                canvas.add(fabricImage);
                canvas.renderAll();

                setUploadMessage("uploaded");
                setTimeout(() => {
                    setUploadMessage("");
                }, 3000);
            });

            videoElement.addEventListener("progress", ()=> {
                if(videoElement.buffered.length > 0)
                {
                    const bufferedEnd = videoElement.buffered.end(
                        videoElement.buffered.length - 1
                    );
                    const duration = videoElement.duration;
                    if(duration > 0)
                    {
                        setLoadedPercentage((bufferedEnd / duration) * 100);
                    }
                }
            });

            videoElement.addEventListener("error", (error)=> {
                console.log("video error",error);
            });

            videoRef.current = videoElement;
        }
    }

    const handlePlayPauseVideo = ()=> {
        if(videoRef.current)
        {
            if(videoRef.current.paused)
            {
                videoRef.current.play();
                videoRef.current.addEventListener("timeupdate", ()=> {
                    fabricVideo.setElement(videoRef.current);
                    canvas.renderAll();
                });
                setIsPlaying(true);
            }
            else
            {
                videoRef.current.pause();
                setIsPlaying(false);
            }
        }
    }

    const handleStopVideo = ()=> {
        if(videoRef.current)
        {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
            canvas.renderAll();
        }
    }

    const handleVideoUploadButtonClick = ()=> {
        fileInputRef.current.click();
    }

    const handleStartRecording = ()=> {
        const stream = canvasRef.current.captureStream();
        mediaRecorderRef.current = new MediaRecorder(stream, {
            mimeType: "video/webm; codecs=vp9",
        })

        mediaRecorderRef.current.ondataavailable = handleDataAvailable;
        mediaRecorderRef.current.start();
        setIsRecording(true);

        canvas.getObjects().foreach((obj) => {
            obj.hasControls = false;
            obj.selectable = true;
        });

        canvas.renderAll();

        setRecordingTime(0);
        recordingIntervalRef.current = setInterval(() => {
            setRecordingTime((prev) => prev + 1);
        }, 1000)
    }

    const handleStopRecording = ()=> {
        mediaRecorderRef.current.stop();
        setIsRecording(false);

        canvas.getObjects().foreach((obj) => {
            obj.hasControls = true;
        });
        canvas.renderAll();

        clearInterval(recordingIntervalRef.current);
    }

    const handleDataAvailable = (event)=> {
        if(event.data.size > 0)
        {
            setRecordingChunks((prev) => [...prev, event.data])
        }
    };

    const handleExportvideo = ()=> {
        const blob = new Blob(recordingChunks, {
            type: "video/webm"
        });

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "canvas-video.webm";
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        setRecordingChunks([]);
    };

    return (
        <>
        <input 
            ref={fileInputRef}
            type="file"
            style={{ display: "none"}}
            accept="video/mp4"
            onChange={handleVideoUpload}
        />
        <IconButton
            onClick={handleVideoUploadButtonClick}
            variant="ghost"
            size="medium"
        >
            <VideoCameraFrontOutlined /> 
        </IconButton>
        {videoSrc && (
            <><Button onClick={handlePlayPauseVideo}>
                {isPlaying ? "Pause video" : "Play video"}
            </Button>
            <Button onClick={handleStopVideo}>
                Stop
            </Button></>
        )}
        <Button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            showBadge={isRecording}
            badgeLabel={new Date(recordingTime * 1000)
                .toISOString()
                .substr(11, 8)
            }
            >
                {isRecording ? (
                    <><Stop /> End</>
                ):(
                    <><PlayCircle /> Record</>
                )}
        </Button>
        <Button onClick={handleExportvideo}
        disabled={!recordingChunks.length}>Export Video</Button>
        </>
    )
}

export default Video;