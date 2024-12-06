import React from "react";
import Navbar from "../components/Navbar";

export default function Firstpage() {
  return (
    <>
      <div>
        <Navbar title="NLP Translator" />
      </div>
      <h1 style={{ textAlign: "center" }}>Welcome to Speech Converter</h1>

      <p style={{ textAlign: "center" }}>
        Use the Home button to go to Speech to Text Converter page.
      </p>

      <p style={{ textAlign: "center" }}>
        Use ChatGPT to interact with AI.
      </p>
    </>
  );
}
