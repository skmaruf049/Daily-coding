import Editor from "@monaco-editor/react";

export default function CodeEditor({ code, setCode }) {
  return (
    <Editor
      height="300px"
      theme="vs-dark"
      language="python"
      value={code}
      onChange={(v) => setCode(v)}
      options={{ fontSize: 16, minimap: { enabled: false } }}
    />
  );
}
