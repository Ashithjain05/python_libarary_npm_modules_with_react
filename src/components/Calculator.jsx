import React, { useState } from "react";
import axios from "axios";
import {
  add_scalar,
  subtract_scalar,
  multiply_scalar,
  divide_scalar,
  power_scalar,
  square,
  sqrt,
  log as jslog,
  exp,
  sin,
  cos,
  tan,
  mean,
  median,
  std,
  variance,
  cumsum,
  zscore,
  minmax_scale,
  pct_change,
} from "proj-math-lib";

// operations list for both BE & FE
const OPS = [
  "add_scalar",
  "subtract_scalar",
  "multiply_scalar",
  "divide_scalar",
  "power_scalar",
  "square",
  "sqrt",
  "log",
  "exp",
  "sin",
  "cos",
  "tan",
  "mean",
  "median",
  "std",
  "var",
  "cumsum",
  "zscore",
  "minmax_scale",
  "pct_change",
];

const JS_OP_MAP = {
  add_scalar,
  subtract_scalar,
  multiply_scalar,
  divide_scalar,
  power_scalar,
  square,
  sqrt,
  log: jslog,
  exp,
  sin,
  cos,
  tan,
  mean,
  median,
  std,
  var: variance,
  cumsum,
  zscore,
  minmax_scale,
  pct_change,
};

export default function Calculator() {
  const [numbers, setNumbers] = useState("1,2,3");
  const [operation, setOperation] = useState("square");
  const [scalarK, setScalarK] = useState(2); // for *_scalar ops, power_scalar
  const [usePython, setUsePython] = useState(true);
  const [rows, setRows] = useState([]);

  const calculate = async () => {
    const nums = numbers.split(",").map(Number);
    let result;

    try {
      if (usePython) {
        const response = await axios.post("http://127.0.0.1:5000/calculate", {
          numbers: nums,
          operation,
          params:
            operation.includes("scalar") || operation === "power_scalar"
              ? { k: scalarK }
              : {},
        });
        result = response.data.result;
      } else {
        // Use JS library
        if (!JS_OP_MAP[operation]) {
          alert("Operation not implemented in JS lib");
          return;
        }
        if (operation.includes("scalar") || operation === "power_scalar") {
          result = JS_OP_MAP[operation](nums, scalarK);
        } else {
          result = JS_OP_MAP[operation](nums);
        }
      }

      const row = {
        timestamp: new Date().toISOString(),
        operation,
        input: numbers,
        params:
          operation.includes("scalar") || operation === "power_scalar"
            ? `k=${scalarK}`
            : "-",
        result: Array.isArray(result) ? JSON.stringify(result) : result,
      };

      // Put new row at the top
      setRows((prev) => [row, ...prev]);
    } catch (err) {
      alert("Error: " + err);
    }
  };

  const downloadCSV = () => {
    if (rows.length === 0) return;
    const headers = ["timestamp", "operation", "input", "params", "result"];
    const csvRows = [headers.join(",")];
    rows.forEach((r) => {
      const values = headers.map(
        (h) => `"${String(r[h]).replace(/"/g, '""')}"`
      );
      csvRows.push(values.join(","));
    });
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `results_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="layout">
      <div className="left">
        <h2>
          Calculator (React + {usePython ? "Flask+pandas" : "proj-math-lib"})
        </h2>

        <label>
          Numbers (comma separated):
          <input
            type="text"
            value={numbers}
            onChange={(e) => setNumbers(e.target.value)}
          />
        </label>

        <label>
          Operation:
          <select
            value={operation}
            onChange={(e) => setOperation(e.target.value)}>
            {OPS.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        </label>

        {(operation.includes("scalar") || operation === "power_scalar") && (
          <label>
            k value:
            <input
              type="number"
              value={scalarK}
              onChange={(e) => setScalarK(Number(e.target.value))}
            />
          </label>
        )}

        <label style={{ display: "block", marginTop: 10 }}>
          <input
            type="checkbox"
            checked={usePython}
            onChange={() => setUsePython(!usePython)}
          />
          Use Python pandas backend
        </label>

        <button onClick={calculate} style={{ marginTop: 10 }}>
          Enter
        </button>
      </div>

      <div className="right">
        <div className="header">
          <h2>Outputs (newest first)</h2>
          <button onClick={downloadCSV} disabled={rows.length === 0}>
            Download CSV
          </button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Operation</th>
              <th>Input</th>
              <th>Params</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td>{r.timestamp}</td>
                <td>{r.operation}</td>
                <td>{r.input}</td>
                <td>{r.params}</td>
                <td style={{ whiteSpace: "pre-wrap" }}>{r.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
