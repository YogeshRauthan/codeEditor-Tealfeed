// src/CodeEditor.js
import React, { useState, useCallback } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-jsx"; // set language
import "prismjs/themes/prism.css"; // set theme

const CodeEditor = () => {
  const [code, setCode] = useState("");

  const handleKeyDown = useCallback(
    (e) => {
      const { key, target } = e;
      const { selectionStart, selectionEnd } = target;

      // if Tab is pressed prevents its default behavior and handle thenew function
      if (key === "Tab") {
        e.preventDefault();
        setCode(
          (prevCode) =>
            `${prevCode.substring(0, selectionStart)}  ${prevCode.substring(
              selectionEnd
            )}` // add 2 spaces
        );
        setTimeout(() => {
          target.selectionStart = target.selectionEnd = selectionStart + 2; // set both value to start+2
        }, 0);
      }

      // Handle auto-closing brackets, parentheses, and quotes
      const autoCloseMap = {
        "{": "}",
        "(": ")",
        "[": "]",
        '"': '"',
        "'": "'",
      };

      if (key in autoCloseMap) {
        e.preventDefault();
        const closingChar = autoCloseMap[key];

        if (selectionStart === selectionEnd) {
          // No text selected, insert both characters
          setCode(
            (prevCode) =>
              `${prevCode.substring(
                0,
                selectionStart
              )}${key}${closingChar}${prevCode.substring(selectionEnd)}`
          );
          setTimeout(() => {
            target.selectionStart = target.selectionEnd = selectionStart + 1;
          }, 0);
        } else {
          // Text is selected, wrap it with the characters
          const selectedText = code.substring(selectionStart, selectionEnd);
          setCode(
            (prevCode) =>
              `${prevCode.substring(
                0,
                selectionStart
              )}${key}${selectedText}${closingChar}${prevCode.substring(
                selectionEnd
              )}`
          );
          setTimeout(() => {
            target.selectionStart = selectionStart + 1;
            target.selectionEnd = selectionEnd + 1;
          }, 0);
        }
      }
    },
    [code]
  );

  const handleChange = (e) => {
    setCode(e.target.value);
  };

  return (
    <div className="codeEditor">
      <textarea
        className="codeInput"
        spellCheck="false"
        value={code}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <pre className="codeOutput">
        <code
          className="language-jsx"
          dangerouslySetInnerHTML={{
            __html: Prism.highlight(code, Prism.languages.jsx, "jsx"),
          }}
        />
      </pre>
    </div>
  );
};

export default CodeEditor;
