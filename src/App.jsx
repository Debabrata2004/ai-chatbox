import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  async function generateAnswer() {
    setAnswer("loading...");
    try {
      const response = await axios({
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC3MbDkxp13tWyTHJEppfWS9aZc-uZu_Ug",
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: question,
                },
              ],
            },
          ],
        },
      });

      // Remove * characters from the response text
      const cleanText = response.data.candidates[0].content.parts[0].text.replace(/\*/g, "");
      setAnswer(cleanText);
      setQuestion("");
    } catch (error) {
      setAnswer("Oops! Something went wrong. Please try again.");
      console.error(error);
    }
  }

  return (
    <div className="app-container">
      <h1>CHAT AI</h1>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask me anything..."
      ></textarea>
      <button onClick={generateAnswer} disabled={!question.trim()}>
        Generate answer
      </button>
      <pre className="answer-box">{answer}</pre>
    </div>
  );
}

export default App;
