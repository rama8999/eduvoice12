import React, { useState, useEffect } from "react";
const h = React.createElement;
import { PAGES, SUBJ, MOOD, DEPTS, ST0, FB0 } from "../data.js";
import { useStore, useCount } from "../hooks.js";
import { agg, ago } from "../utils.js";
import { Stat, Bars, Dist, Comments } from "../components/Widgets.jsx";

export default function Summary({ fb }) {
  const [k, setK] = useState("s");
  const [asc, setAsc] = useState(true);

  const a = agg(fb).sort((x, y) =>
    (asc ? 1 : -1) *
    (k === "s" ? x.s.localeCompare(y.s) : x[k] - y[k])
  );

  const hd = [
    ["s", "Subject"],
    ["n", "Responses"],
    ["r", "Average"]
  ];
  return h("section", { className: "pg" },
    h("div", { className: "wrap" },
      h("h2", null, "Live feedback summary"),
      h("p", { className: "sub" },
        "Updates automatically when new feedback is submitted. Click a heading to sort."
      ),
      h("div", { className: "tw" },
        h("table", null,
          h("thead", null,
            h("tr", null,
              hd.map(c =>
                h("th", {
                  key: c[0],
                  className: "sort",
                  onClick: () => {
                    c[0] === k
                      ? setAsc(!asc)
                      : (setK(c[0]), setAsc(false));
                  }
                },
                  c[1] + (k === c[0] ? (asc ? " ▲" : " ▼") : "")
                )
              ),
              h("th", null, "Score")
            )
          ),
          h("tbody", null,
            a.map((x, i) =>
              h("tr", {
                key: x.s,
                style: { animationDelay: i * 50 + "ms" }
              },
                h("td", null, x.s),
                h("td", null, x.n),
                h("td", null, "★ " + x.r.toFixed(1)),
                h("td", null,
                  h("div", { className: "meter" },
                    h("span", {
                      style: { width: x.r * 20 + "%" }
                    })
                  )
                )
              )
            )
          )
        )
      ),
      h("div", { className: "two" },
        h("div", { className: "card" },
          h("h3", null, "Rating distribution"),
          h(Dist, { fb })
        ),
        h("div", { className: "card" },
          h("h3", null, "Recent comments"),
          h(Comments, { fb, n: 4 })
        )
      )
    )
  );
}
