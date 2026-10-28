import React, { useState, useEffect } from "react";
const h = React.createElement;

import { PAGES, SUBJ, MOOD, DEPTS, ST0, FB0 } from "../data.js";
import { useStore, useCount } from "../hooks.js";
import { agg, ago } from "../utils.js";
import { Stat, Bars, Dist, Comments } from "../components/Widgets.jsx";

export default function Contact({ toast }) {
  const e0 = {
    name: "",
    email: "",
    subject: "",
    message: ""
  };

  const [f, setF] = useState(e0);
  const [err, setErr] = useState("");

  const set = k => e => setF({
    ...f,
    [k]: e.target.value
  });

  const send = () => {
    if (
      !f.name.trim() ||
      !/^\S+@\S+\.\S+$/.test(f.email) ||
      f.message.trim().length < 10
    ) {
      setErr(
        "Enter your name, a valid email and a message of at least 10 characters."
      );
      return;
    }

    setErr("");
    setF(e0);

    toast("Message sent! We will reply soon. ✉️");
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

      h("h2", null, "Contact us"),

      h(
        "p",
        { className: "sub" },
        "Questions or suggestions? We reply within two working days."
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

            h("label", null, "Name"),

            h("input", {
              value: f.name,
              onChange: set("name")
            })
          ),

          h(
            "div",
            null,

            h("label", null, "Email"),

            h("input", {
              type: "email",
              value: f.email,
              onChange: set("email")
            })
          )
        ),

        h("label", null, "Subject"),

        h("input", {
          value: f.subject,
          onChange: set("subject")
        }),

        h("label", null, "Message"),

        h("textarea", {
          rows: 5,
          value: f.message,
          onChange: set("message")
        }),

        h(
          "div",
          { style: { marginTop: 18 } },

          h(
            "button",
            {
              className: "btn",
              onClick: send
            },
            "Send message"
          )
        ),

        err && h("div", { className: "msg" }, err)
      )
    )
  );
}