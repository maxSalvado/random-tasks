/// TODO UPADTE PRETTYJSON COMPONENT:
1) Copy & Download toolbar (plug-and-play)
import { useMemo, useState } from "react";

export function PrettyJson({ data, space = 2, style = {} }) {
  const json = useMemo(() => JSON.stringify(data, null, space), [data, space, data]);
  return (
    <pre
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        background: "var(--pj-bg, #0b1020)",
        color: "var(--pj-fg, #d7e8ff)",
        padding: "12px 14px",
        borderRadius: 8,
        fontSize: 13,
        lineHeight: 1.45,
        ...style,
      }}
    >
      {json}
    </pre>
  );
}

export function PrettyJsonCard({ data, filename = "data.json", initialWrap = true }) {
  const [wrap, setWrap] = useState(initialWrap);
  const json = useMemo(() => JSON.stringify(data, null, 2), [data]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json);
      alert("Copied JSON to clipboard");
    } catch {
      alert("Couldn’t copy—your browser may block clipboard access.");
    }
  };

  const download = () => {
    const blob = new Blob([json], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      overflow: "hidden",
      boxShadow: "0 1px 2px rgba(0,0,0,.05)"
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8, justifyContent: "space-between",
        padding: "8px 10px", background: "#f8fafc", borderBottom: "1px solid #e5e7eb"
      }}>
        <strong style={{ fontSize: 12, color: "#334155" }}>JSON</strong>
        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={copy} style={btnStyle}>Copy</button>
          <button onClick={download} style={btnStyle}>Download</button>
          <label style={{ ...btnStyle, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={wrap}
              onChange={(e) => setWrap(e.target.checked)}
              style={{ marginRight: 6 }}
            />
            Wrap
          </label>
        </div>
      </div>
      <pre style={{
        margin: 0,
        padding: "12px 14px",
        whiteSpace: wrap ? "pre-wrap" : "pre",
        wordBreak: wrap ? "break-word" : "normal",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        background: "#0b1020",
        color: "#d7e8ff",
        fontSize: 13,
        lineHeight: 1.45
      }}>{json}</pre>
    </div>
  );
}

const btnStyle = {
  fontSize: 12,
  padding: "6px 10px",
  border: "1px solid #cbd5e1",
  background: "#fff",
  borderRadius: 6,
};


Use it

<PrettyJsonCard data={apiResponse} filename="query-result.json" />

2) Bonus: “auto-limit” huge arrays (keeps UI snappy)

If your endpoint sometimes returns a massive array, you can show just the first N items with a hint:

function capArray(data, maxItems = 1000) {
  if (!Array.isArray(data) || data.length <= maxItems) return data;
  return {
    _preview: data.slice(0, maxItems),
    _meta: { truncated: true, total: data.length, shown: maxItems }
  };
}

// Example before rendering:
const displayData = Array.isArray(apiResponse) ? capArray(apiResponse, 500) : apiResponse;
<PrettyJsonCard data={displayData} />
