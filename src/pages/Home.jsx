import React, { useState, useEffect } from "react";
const h = React.createElement;
import { PAGES, SUBJ, MOOD, DEPTS, ST0, FB0 } from "../data.js";
import { useStore, useCount } from "../hooks.js";
import { agg, ago } from "../utils.js";
import { Stat, Bars, Dist, Comments } from "../components/Widgets.jsx";

export default function Home({ go, fb }) {
  const a = agg(fb);
  const avg = fb.length ? fb.reduce((x, f) => x + f.r, 0) / fb.length : 0;

  const feats = [
    ["📝", "Feedback form", "Star ratings with live mood feedback."],
    ["👥", "Student list", "Search, filter, sort and add students."],
    ["📊", "Live summary", "Charts that update the moment feedback arrives."],
    ["🔐", "Admin login", "Review and moderate responses."],
    ["✉️", "Contact form", "Validated message form."]
  ];

  return h("div", null,
    h("div", { className: "hero" },
      h("div", { className: "blob b1" }),
      h("div", { className: "blob b2" }),
      h("div", { className: "blob b3" }),
      h("div", { className: "wrap" },
        h("h1", null, "Your voice shapes better learning"),
        h("p", null, "EduVoice is a live, responsive portal where students share feedback and staff see results instantly."),
        h("button", {
          className: "btn w",
          onClick: () => go("feedback")
        }, "Give feedback"),
        h("button", {
          className: "btn o",
          onClick: () => go("summary")
        }, "View live summary")
      )
    ),

    h("section", { className: "pg" },
      h("div", { className: "wrap" },
        h("div", {
          className: "grid",
          style: { marginBottom: 24 }
        },
          h(Stat, { label: "Responses", v: fb.length }),
          h(Stat, { label: "Average rating", v: avg, d: 1, suf: " / 5" }),
          h(Stat, { label: "Subjects", v: SUBJ.length }),
          h(Stat, {
            label: "Satisfied (4–5 ★)",
            v: fb.length ? fb.filter(f => f.r >= 4).length / fb.length * 100 : 0,
            suf: "%"
          })
        ),

        h("div", { className: "two" },
          h("div", { className: "card" },
            h("h3", null, "Top subjects right now"),
            h(Bars, {
              data: [...a].sort((x, y) => y.r - x.r).slice(0, 4)
            })
          ),

          h("div", { className: "card" },
            h("h3", null, "Latest comments"),
            h(Comments, { fb, n: 3 })
          )
        ),

        h("h2", null, "Everything in one place"),
        h("p", { className: "sub" }, "Five pages, one clean experience on any screen."),

        h("div", { className: "grid" },
          feats.map(f =>
            h("div", { className: "card", key: f[1] },
              h("div", { className: "ico" }, f[0]),
              h("h3", null, f[1]),
              h("p", null, f[2])
            )
          )
        )
      )
    )
  );
}
