
import React, { useState } from "react";
const h = React.createElement;

import { SUBJ, MOOD } from "../data.js";

export default function Feedback({ add, user }) {
  const e0 = {
    name: user?.name || "",
    id: user?.id || "",
    subject: SUBJ[0],
    rating: 0,
    text: ""
  };

  const [f, setF] = useState(e0);
  const [hv, setHv] = useState(0);
  const [err, setErr] = useState("");

  const set = (key) => (e) => {
    setF((previous) => ({
      ...previous,
      [key]: e.target.value
    }));
  };

  const shown = hv || f.rating;

  const submit = () => {
    if (!f.name.trim() || !f.id.trim() || !f.rating) {
      setErr("Please enter your name, Student ID and rating.");
      return;
    }

    add({
      name: f.name.trim(),
      id: f.id.trim(),
      s: f.subject,
      r: f.rating,
      text: f.text.trim() || "(no comment)"
    });

    setErr("");

    setF({
      ...e0,
      subject: SUBJ[0],
      rating: 0,
      text: ""
    });

    setHv(0);
  };

  return h(
    "section",
    { className: "pg" },

    h(
      "div",
      {
        className: "wrap narrow",
        style: { maxWidth: 640 }
      },

      h("h2", null, "Share your feedback"),

      h(
        "p",
        { className: "sub" },
        "Your response is added to the live summary instantly."
      ),

      h(
        "div",
        { className: "card" },

        h(
          "div",
          { className: "row" },

          h(
            "div",
            null,
            h("label", null, "Full name"),

            h("input", {
              value: f.name,
              onChange: set("name"),
              placeholder: "Your name"
            })
          ),

          h(
            "div",
            null,
            h("label", null, "Student ID"),

            h("input", {
              value: f.id,
              onChange: set("id"),
              placeholder: "e.g. S101"
            })
          )
        ),

        h("label", null, "Subject / service"),

        h(
          "select",
          {
            value: f.subject,
            onChange: set("subject")
          },

          SUBJ.map((subject) =>
            h(
              "option",
              { key: subject, value: subject },
              subject
            )
          )
        ),

        h("label", null, "Rating"),

        h(
          "div",
          {
            className: "stars",
            onMouseLeave: () => setHv(0)
          },

          [1, 2, 3, 4, 5].map((n) =>
            h(
              "button",
              {
                key: n,
                type: "button",
                "aria-label": `${n} stars`,
                className: n <= shown ? "on" : "",
                onMouseEnter: () => setHv(n),
                onClick: () =>
                  setF((previous) => ({
                    ...previous,
                    rating: n
                  }))
              },
              "★"
            )
          )
        ),

        h(
          "div",
          { className: "mood" },
          MOOD[shown] || "Select a rating"
        ),

        h(
          "label",
          null,
          "Comments",
          h(
            "span",
            { className: "cnt" },
            `${f.text.length}/200`
          )
        ),

        h("textarea", {
          rows: 4,
          maxLength: 200,
          value: f.text,
          onChange: set("text"),
          placeholder: "What worked well? What could improve?"
        }),

        h(
          "div",
          { style: { marginTop: 18 } },

          h(
            "button",
            {
              className: "btn",
              type: "button",
              onClick: submit
            },
            "Submit feedback"
          )
        ),

        err && h("div", { className: "msg" }, err)
      )
    )
  );
}
