import { useState, Fragment } from "react";

const isPlainObject = (v) => v !== null && typeof v === "object" && !Array.isArray(v);

function Scalar({ value }) {
  const t = typeof value;
  if (value === null) return <span style={{ color: "#a0a0a0" }}>null</span>;
  if (t === "string") return <span style={{ color: "#a8e1ff" }}>"{value}"</span>;
  if (t === "number" || t === "bigint") return <span style={{ color: "#ffd580" }}>{String(value)}</span>;
  if (t === "boolean") return <span style={{ color: "#ffb3ba" }}>{String(value)}</span>;
  return <span>{String(value)}</span>;
}

function Toggle({ open, setOpen }) {
  return (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      style={{
        border: 0,
        background: "transparent",
        cursor: "pointer",
        color: "#93c5fd",
        fontWeight: 600,
        marginRight: 6,
      }}
      title={open ? "Collapse" : "Expand"}
    >
      {open ? "▾" : "▸"}
    </button>
  );
}

function Line({ depth, children }) {
  return (
    <div style={{ paddingLeft: depth * 14, display: "flex", alignItems: "baseline", gap: 6 }}>
      {children}
    </div>
  );
}

export function JsonViewer({ data, collapseAt = 1, depth = 0, previewItems = 50 }) {
  // Scalars
  if (!isPlainObject(data) && !Array.isArray(data)) {
    return <Scalar value={data} />;
  }

  // Arrays
  if (Array.isArray(data)) {
    const [open, setOpen] = useState(depth < collapseAt);
    const len = data.length;
    return (
      <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 13 }}>
        <Line depth={depth}>
          <Toggle open={open} setOpen={setOpen} />
          <span style={{ color: "#60a5fa" }}>[Array]</span>
          <span style={{ color: "#a0a0a0" }}> ({len} item{len !== 1 ? "s" : ""})</span>
        </Line>
        {open && (
          <div>
            {data.slice(0, previewItems).map((item, i) => (
              <Line key={i} depth={depth + 1}>
                <span style={{ color: "#9ca3af" }}>{i}:</span>{" "}
                <JsonViewer data={item} collapseAt={collapseAt} depth={depth + 1} previewItems={previewItems} />
              </Line>
            ))}
            {len > previewItems && (
              <Line depth={depth + 1}>
                <span style={{ color: "#9ca3af" }}>… {len - previewItems} more not shown</span>
              </Line>
            )}
          </div>
        )}
      </div>
    );
  }

  // Objects
  const entries = Object.entries(data);
  const [open, setOpen] = useState(depth < collapseAt);
  return (
    <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", fontSize: 13 }}>
      <Line depth={depth}>
        <Toggle open={open} setOpen={setOpen} />
        <span style={{ color: "#34d399" }}>{`{Object}`}</span>
        <span style={{ color: "#a0a0a0" }}> ({entries.length} key{entries.length !== 1 ? "s" : ""})</span>
      </Line>
      {open && (
        <div>
          {entries.map(([k, v]) => (
            <Line key={k} depth={depth + 1}>
              <span style={{ color: "#93c5fd" }}>{k}:</span>{" "}
              <JsonViewer data={v} collapseAt={collapseAt} depth={depth + 1} previewItems={previewItems} />
            </Line>
          ))}
        </div>
      )}
    </div>
  );
}



---



 export function PrettyJson({ data }) {
  return (
    <pre
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
        background: "#0b1020",
        color: "#d7e8ff",
        padding: "12px 14px",
        borderRadius: 8,
        fontSize: 13,
        lineHeight: 1.45,
      }}
    >
      {JSON.stringify(data, null, 2)}
    </pre>
  );
}




                                     
