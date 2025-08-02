self.onmessage = (e) => {
  const { audioChunk } = e.data

  // Placeholder: simulate a result after 1 second
  setTimeout(() => {
    self.postMessage({ finalTranscript: "This is a simulated transcript." })
  }, 1000)
}
