

import React, { useState } from "react";
const h = React.createElement;

import { SUBJ } from "../data.js";
import { agg } from "../utils.js";
import {
  Stat,
  Bars,
  Dist
} from "../components/Widgets.jsx";

export default function Admin({
  fb = [],
  del = () => {},
  reset = () => {},
  onLogin = () => {},
  onLogout = () => {},
  loggedIn = false
}) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [sf, setSf] = useState("All");

  const switchMode = (newMode) => {
    setMode(newMode);
    setErr("");
    setSuccess("");
    setPassword("");
    setConfirmPassword("");
  };

  // Sign up with any valid email
  const handleSignup = () => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName || !cleanEmail || !password) {
      setErr("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErr("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErr("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }

    try {
      const accounts = JSON.parse(
        localStorage.getItem("ev-accounts") || "[]"
      );

      const alreadyExists = accounts.some(
        (account) => account.email === cleanEmail
      );

      if (alreadyExists) {
        setErr("This email is already registered. Please log in.");
        return;
      }

      const account = {
        name: cleanName,
        email: cleanEmail,
        password: password
      };

      localStorage.setItem(
        "ev-accounts",
        JSON.stringify([...accounts, account])
      );

      setName("");
      setPassword("");
      setConfirmPassword("");
      setMode("login");
      setErr("");
      setSuccess("Account created! Please log in.");

      // Keep the registered email in the login field
      setEmail(cleanEmail);
    } catch {
      setErr("Unable to create account. Please try again.");
    }
  };

  // Login using a registered email and password
  const handleLogin = () => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setErr("Please enter your email and password.");
      return;
    }

    try {
      const accounts = JSON.parse(
        localStorage.getItem("ev-accounts") || "[]"
      );

      const account = accounts.find(
        (item) =>
          item.email === cleanEmail &&
          item.password === password
      );

      if (!account) {
        setErr("Invalid email or password. Please sign up first.");
        return;
      }

      setErr("");
      onLogin({
        name: account.name,
        email: account.email,
        role: "admin"
      });
    } catch {
      setErr("Unable to log in. Please try again.");
    }
  };

  // Login and signup screen
  if (!loggedIn) {
    return h(
      "section",
      { className: "pg" },
      h(
        "div",
        {
          className: "wrap narrow",
          style: { maxWidth: 460, margin: "40px auto" }
        },

        h(
          "div",
          {
            className: "card",
            style: { padding: 28 }
          },

          h(
            "div",
            {
              style: {
                textAlign: "center",
                marginBottom: 24
              }
            },
            h(
              "div",
              {
                style: {
                  fontSize: 42,
                  marginBottom: 8
                }
              },
              "🔐"
            ),
            h(
              "h2",
              null,
              mode === "login" ? "Welcome Back!" : "Create Account"
            ),
            h(
              "p",
              { className: "sub" },
              mode === "login"
                ? "Log in to access your EduVoice dashboard."
                : "Sign up with your name and email to get started."
            )
          ),

          mode === "signup" &&
            h(
              React.Fragment,
              null,
              h("label", null, "Full name"),
              h("input", {
                type: "text",
                value: name,
                placeholder: "Enter your full name",
                autoComplete: "name",
                onChange: (e) => setName(e.target.value)
              })
            ),

          h("label", null, "Email address"),
          h("input", {
            type: "email",
            value: email,
            placeholder: "Enter your email",
            autoComplete: "email",
            onChange: (e) => setEmail(e.target.value)
          }),

          h("label", null, "Password"),
          h("input", {
            type: "password",
            value: password,
            placeholder: "Enter your password",
            autoComplete:
              mode === "login" ? "current-password" : "new-password",
            onChange: (e) => setPassword(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter") {
                mode === "login" ? handleLogin() : handleSignup();
              }
            }
          }),

          mode === "signup" &&
            h(
              React.Fragment,
              null,
              h("label", null, "Confirm password"),
              h("input", {
                type: "password",
                value: confirmPassword,
                placeholder: "Re-enter your password",
                autoComplete: "new-password",
                onChange: (e) => setConfirmPassword(e.target.value),
                onKeyDown: (e) => {
                  if (e.key === "Enter") handleSignup();
                }
              })
            ),

          err &&
            h(
              "div",
              {
                className: "msg",
                role: "alert",
                style: { marginTop: 14 }
              },
              err
            ),

          success &&
            h(
              "div",
              {
                className: "msg",
                role: "status",
                style: { marginTop: 14 }
              },
              success
            ),

          h(
            "div",
            { style: { marginTop: 20 } },
            h(
              "button",
              {
                className: "btn",
                style: { width: "100%" },
                onClick: mode === "login" ? handleLogin : handleSignup
              },
              mode === "login" ? "Login" : "Create Account"
            )
          ),

          h(
            "p",
            {
              style: {
                textAlign: "center",
                marginTop: 20
              }
            },
            mode === "login"
              ? "Don't have an account? "
              : "Already have an account? ",
            h(
              "button",
              {
                type: "button",
                style: {
                  border: "none",
                  background: "none",
                  color: "var(--accent, #5145e5)",
                  cursor: "pointer",
                  fontWeight: 700
                },
                onClick: () =>
                  switchMode(mode === "login" ? "signup" : "login")
              },
              mode === "login" ? "Sign Up" : "Login"
            )
          )
        )
      )
    );
  }

  // Existing Admin dashboard
  const filtered = fb.filter(
    (f) => sf === "All" || f.s === sf
  );

  return h(
    "section",
    { className: "pg" },
    h(
      "div",
      { className: "wrap" },

      h("h2", null, "Admin dashboard"),
      h("p", { className: "sub" },
        "Manage student feedback and view summaries."
      ),

      h(
        "div",
        { className: "grid" },

        h(Stat, {
          label: "Total responses",
          v: fb.length
        }),

        h(Stat, {
          label: "Average rating",
          v: fb.length
            ? fb.reduce((sum, f) => sum + Number(f.r || 0), 0) / fb.length
            : 0,
          d: 1
        }),

        h(Stat, {
          label: "Low ratings (1–2 stars)",
          v: fb.filter((f) => f.r <= 2).length
        })
      ),

      h(
        "div",
        { className: "two" },

        h(
          "div",
          { className: "card" },
          h("h3", null, "Average by subject"),
          h(Bars, { data: agg(fb) })
        ),

        h(
          "div",
          { className: "card" },
          h("h3", null, "Rating distribution"),
          h(Dist, { fb })
        )
      ),

      h(
        "div",
        { className: "chips" },
        ["All", ...SUBJ].map((subject) =>
          h(
            "button",
            {
              key: subject,
              className: "chip" + (sf === subject ? " on" : ""),
              onClick: () => setSf(subject)
            },
            subject
          )
        )
      ),

      h(
        "div",
        { className: "tw" },
        h(
          "table",
          null,

          h(
            "thead",
            null,
            h(
              "tr",
              null,
              ...["Student", "Subject", "Rating", "Comment", ""].map(
                (column) => h("th", { key: column }, column)
              )
            )
          ),

          h(
            "tbody",
            null,

            ...filtered.map((f) =>
              h(
                "tr",
                { key: f.id },
                h("td", null, f.name),
                h("td", null, f.s),
                h("td", null, "★ " + f.r),
                h("td", null, f.text),
                h(
                  "td",
                  null,
                  h(
                    "button",
                    {
                      className: "btn s d",
                      onClick: () => del(f.id)
                    },
                    "Delete"
                  )
                )
              )
            ),

            filtered.length === 0 &&
              h(
                "tr",
                null,
                h("td", { colSpan: 5 }, "No feedback to show.")
              )
          )
        )
      ),

      h(
        "div",
        {
          style: {
            marginTop: 20,
            display: "flex",
            gap: 10,
            flexWrap: "wrap"
          }
        },

        h(
          "button",
          { className: "btn", onClick: onLogout },
          "Log out"
        ),

        h(
          "button",
          { className: "btn d", onClick: reset },
          "Reset demo data"
        )
      )
    )
  );
}
