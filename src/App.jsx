import { useState, useRef } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support Speech Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      console.log("Listening...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("Transcript:", transcript);
      setQuestion(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Microphone error: " + event.error);
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log("Stopped listening");
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const generateAnswer = async () => {
    setAnswer("loading...");
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC3MbDkxp13tWyTHJEppfWS9aZc-uZu_Ug",
        method: "post",
        data: {
          contents: [{ parts: [{ text: question }] }],
        },
      });

      const cleanText = response.data.candidates[0].content.parts[0].text.replace(/\*/g, "");
      setAnswer(cleanText);
      setQuestion("");
    } catch (error) {
      console.error(error);
      setAnswer("Oops! Something went wrong.");
    }
  };

  return (
    <div className="app-container">
      <h1>CHAT AI</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask me anything..."
      ></textarea>

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={generateAnswer} disabled={!question.trim()}>
          Generate Answer
        </button>
        <button onClick={startListening}>
          🎤 {isListening ? "Listening..." : "Speak"}
        </button>
      </div>

      <pre className="answer-box">{answer}</pre>
    </div>
  );
}

export default App;
