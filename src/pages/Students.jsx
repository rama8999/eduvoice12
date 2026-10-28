import React, { useState, useEffect } from "react";
const h = React.createElement;
import { PAGES, SUBJ, MOOD, DEPTS, ST0, FB0 } from "../data.js";
import { useStore, useCount } from "../hooks.js";
import { agg, ago } from "../utils.js";
import { Stat, Bars, Dist, Comments } from "../components/Widgets.jsx";

export default function Students({ st, setSt, toast }) {
  const [q, setQ] = useState("");
  const [d, setD] = useState("All");
  const [k, setK] = useState(0);
  const [asc, setAsc] = useState(true);
  const [n, setN] = useState({
    name: "",
    dept: "CSE",
    year: "1st Year"
  });

  let l = st
    .filter(s =>
      (d === "All" || s[2] === d) &&
      s.join(" ").toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) =>
      (asc ? 1 : -1) * String(a[k]).localeCompare(String(b[k]))
    );

  const addS = () => {
    if (!n.name.trim()) return toast("Enter a student name");

    const id = "S" + (100 + st.length + 1 + Math.floor(Math.random() * 9));

    setSt([...st, [id, n.name.trim(), n.dept, n.year]]);
    setN({ ...n, name: "" });
    toast("Student added");
  };

  const heads = ["ID", "Name", "Department", "Year"];

  return h("section", { className: "pg" },
    h("div", { className: "wrap" },
      h("h2", null, "Student list (" + st.length + ")"),
      h("p", { className: "sub" },
        "Search, filter by department, click a column to sort."
      ),

      h("input", {
        value: q,
        onChange: e => setQ(e.target.value),
        placeholder: "Search students…",
        style: { maxWidth: 360 }
      }),

      h("div", { className: "chips" },
        ["All", ...DEPTS].map(x =>
          h("button", {
            key: x,
            className: "chip" + (d === x ? " on" : ""),
            onClick: () => setD(x)
          }, x)
        )
      ),

      h("div", { className: "tw" },
        h("table", null,
          h("thead", null,
            h("tr", null,
              heads.map((c, i) =>
                h("th", {
                  key: c,
                  className: "sort",
                  onClick: () => {
                    i === k
                      ? setAsc(!asc)
                      : (setK(i), setAsc(true));
                  }
                },
                  c + (k === i ? (asc ? " ▲" : " ▼") : "")
                )
              ),
              h("th", null, "")
            )
          ),

          h("tbody", null,
            l.map((s, i) =>
              h("tr", {
                key: s[0] + s[1],
                style: { animationDelay: i * 40 + "ms" }
              },
                h("td", null, s[0]),
                h("td", null, s[1]),
                h("td", null,
                  h("span", { className: "pill" }, s[2])
                ),
                h("td", null, s[3]),
                h("td", null,
                  h("button", {
                    className: "btn s d",
                    onClick: () => {
                      setSt(st.filter(x => x !== s));
                      toast("Student removed");
                    }
                  }, "Remove")
                )
              )
            ),

            l.length === 0 &&
              h("tr", null,
                h("td", { colSpan: 5 }, "No students found.")
              )
          )
        )
      ),

      h("div", {
        className: "card",
        style: { marginTop: 20 }
      },
        h("h3", null, "Add a student"),

        h("div", { className: "row" },
          h("div", null,
            h("label", null, "Name"),
            h("input", {
              value: n.name,
              onChange: e => setN({ ...n, name: e.target.value }),
              placeholder: "Full name"
            })
          ),

          h("div", null,
            h("label", null, "Department"),
            h("select", {
              value: n.dept,
              onChange: e => setN({ ...n, dept: e.target.value })
            },
              DEPTS.map(x =>
                h("option", { key: x }, x)
              )
            )
          )
        ),

        h("label", null, "Year"),
        h("select", {
          value: n.year,
          onChange: e => setN({ ...n, year: e.target.value })
        },
          ["1st Year", "2nd Year", "3rd Year", "4th Year"].map(x =>
            h("option", { key: x }, x)
          )
        ),

        h("div", { style: { marginTop: 16 } },
          h("button", {
            className: "btn",
            onClick: addS
          }, "Add student")
        )
      )
    )
  );
}