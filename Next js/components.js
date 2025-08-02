import { useEffect, useRef, useState } from "react"

export default function Recorder() {
  const [recording, setRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [response, setResponse] = useState("")
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  const whisperWorker = useRef<Worker | null>(null)
  const ttsWorker = useRef<Worker | null>(null)

  useEffect(() => {
    // Load workers from public folder
    // @ts-ignore - External workers not typed
    whisperWorker.current = new Worker("/workers/whisperWorker.js")
    // @ts-ignore
    ttsWorker.current = new Worker("/workers/ttsWorker.js")

    // Handle Whisper STT output
    whisperWorker.current.onmessage = async (e) => {
      if (e.data.finalTranscript) {
        const finalTranscript = e.data.finalTranscript
        setTranscript(finalTranscript)

        try {
          const openaiResp = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: finalTranscript }),
          })

          const { reply } = await openaiResp.json()
          setResponse(reply)

          // Send reply to TTS worker
          ttsWorker.current?.postMessage({ text: reply })
        } catch (err) {
          console.error("OpenAI fetch failed:", err)
        }
      }
    }

    // Handle TTS audio output
    ttsWorker.current.onmessage = (e) => {
      const audioBlob = e.data.audioBlob
      const audio = new Audio(URL.createObjectURL(new Blob([audioBlob], { type: "audio/wav" })))
      audio.play()
    }

    return () => {
      whisperWorker.current?.terminate()
      ttsWorker.current?.terminate()
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        whisperWorker.current?.postMessage({ audioChunk: event.data })
      }

      mediaRecorder.start(250) // send chunks every 250ms
      setRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  return (
    <div className="p-4">
      <button
        onClick={recording ? stopRecording : startRecording}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {recording ? "Stop" : "Start"} Recording
      </button>

      <div className="mt-4 space-y-2">
        <p><strong>Transcript:</strong> {transcript}</p>
        <p><strong>Response:</strong> {response}</p>
      </div>
    </div>
  )
}
