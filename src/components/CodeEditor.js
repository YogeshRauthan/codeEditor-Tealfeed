// src/components/CodeEditor.js
import React, { useState, useCallback } from "react";
import { Highlight, themes } from "prism-react-renderer";

const CodeEditor = () => {
  const [code, setCode] = useState("");

  const handleKeyDown = useCallback(
    (e) => {
      const { key, target } = e;
      const { selectionStart, selectionEnd } = target;

      if (key === "Tab") { // if Tab is pressed prevent its default beahvior and handle its function
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

      const autoCloseMap = {
        "{": "}",
        "(": ")",
        "[": "]",
        '"': '"',
        "'": "'",
      };

      // if any of the above keys are pressed then automatically complete it
      if (key in autoCloseMap) {
        e.preventDefault();
        const closingChar = autoCloseMap[key];

        if (selectionStart === selectionEnd) {
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
      <Highlight
        theme={themes.github}
        code={code}
        language="jsx"
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} codeOutput`} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })} key={i}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} key={key} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default CodeEditor;
