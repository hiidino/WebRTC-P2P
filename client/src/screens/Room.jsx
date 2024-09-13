const handleCallUser = useCallback(async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  } catch (err) {
    if (err.name === "NotAllowedError") {
      alert("Please allow access to your camera and microphone.");
    } else {
      console.error("Error accessing media devices:", err);
    }
  }
}, [remoteSocketId, socket]);

const handleIncommingCall = useCallback(
  async ({ from, offer }) => {
    try {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);
      console.log(`Incoming Call`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    } catch (err) {
      if (err.name === "NotAllowedError") {
        alert("Please allow access to your camera and microphone.");
      } else {
        console.error("Error accessing media devices:", err);
      }
    }
  },
  [socket]
);
