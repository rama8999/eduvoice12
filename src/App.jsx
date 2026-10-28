import React, { useState, useEffect } from "react";
const h = React.createElement;
import { PAGES, FB0, ST0 } from "./data.js";
import { useStore } from "./hooks.js";
import Home from "./pages/Home.jsx";
import Feedback from "./pages/Feedback.jsx";
import Students from "./pages/Students.jsx";
import Summary from "./pages/Summary.jsx";
import Admin from "./pages/Admin.jsx";
import Contact from "./pages/Contact.jsx";

export default function App() {
  const get = () => {
    let savedUser = null;

    try {
      savedUser = JSON.parse(localStorage.getItem("ev-user"));
    } catch {
      savedUser = null;
    }

    // Login avvakapothe direct ga Login page open avuthundi
    if (!savedUser) return "admin";

    const hash = window.location.hash.slice(1);

    return PAGES.some((p) => p[0] === hash) ? hash : "students";
  };

  const [pg, setPg] = useState(get);
  const [open, setOpen] = useState(false);
  const [tm, setTm] = useState(null);

  const [fb, setFb] = useStore("ev-fb", FB0);
  const [st, setSt] = useStore("ev-st", ST0);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ev-user")) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleHash = () => {
      const nextPage = get();
      setPg(nextPage);
      setOpen(false);
    };

    window.addEventListener("hashchange", handleHash);

    return () => {
      window.removeEventListener("hashchange", handleHash);
    };
  }, []);

  useEffect(() => {
    if (!tm) return;

    const timer = setTimeout(() => setTm(null), 2600);

    return () => clearTimeout(timer);
  }, [tm]);

  const toast = (message) => setTm(message);

  const go = (page) => {
    if (!user && page !== "admin") {
      toast("Please login or sign up first");
      return;
    }

    if (user?.role === "student" && page === "admin") {
      toast("Admin access required");
      return;
    }

    if (user?.role === "admin" && page === "feedback") {
      toast("Only students can submit feedback");
      return;
    }

    window.location.hash = page;
    setPg(page);
    setOpen(false);
    window.scrollTo(0, 0);
  };

  const handleLogin = (loggedInUser) => {
    localStorage.setItem("ev-user", JSON.stringify(loggedInUser));

    setUser(loggedInUser);

    const destination =
      loggedInUser.role === "admin" ? "admin" : "students";

    window.location.hash = destination;
    setPg(destination);
    setOpen(false);

    toast("Login successful!");
    window.scrollTo(0, 0);
  };

  const logout = () => {
    localStorage.removeItem("ev-user");

    setUser(null);
    window.location.hash = "admin";
    setPg("admin");
    setOpen(false);

    toast("Logged out successfully");
    window.scrollTo(0, 0);
  };

  const add = (feedback) => {
    setFb((previous) => [
      {
        ...feedback,
        id: Date.now(),
        t: Date.now()
      },
      ...previous
    ]);

    toast("Feedback submitted successfully!");

    window.location.hash = "summary";
    setPg("summary");
    setOpen(false);
    window.scrollTo(0, 0);
  };

  const del = (id) => {
    setFb((previous) => previous.filter((item) => item.id !== id));
    toast("Feedback deleted");
  };

  const reset = () => {
    setFb(FB0);
    setSt(ST0);
    toast("Demo data restored");
  };

  let view;

  // Login avvakapothe Login / Sign up page matrame
  if (!user) {
    view = h(Admin, {
      fb,
      del,
      reset,
      onLogin: handleLogin,
      loggedIn: false
    });
  } else if (user.role === "student") {
    const studentPages = {
      home: h(Home, { go, fb }),

      students: h(Students, {
        st,
        setSt,
        toast,
        user
      }),

      feedback: h(Feedback, {
        add,
        user
      }),

      summary: h(Summary, {
        fb,
        user
      }),

      contact: h(Contact, {
        toast,
        user
      })
    };

    view = studentPages[pg] || studentPages.students;
  } else if (user.role === "admin") {
    const adminPages = {
      home: h(Home, { go, fb }),

      students: h(Students, {
        st,
        setSt,
        toast,
        user
      }),

      summary: h(Summary, {
        fb,
        user
      }),

      admin: h(Admin, {
        fb,
        del,
        reset,
        onLogin: handleLogin,
        onLogout: logout,
        loggedIn: true
      }),

      contact: h(Contact, {
        toast,
        user
      })
    };

    view = adminPages[pg] || adminPages.admin;
  } else {
    view = h(Admin, {
      fb,
      del,
      reset,
      onLogin: handleLogin,
      loggedIn: false
    });
  }

  // Guest ki Login matrame; login ayyaka role batti menu
  const navPages = !user
    ? [["admin", "Login"]]
    : PAGES.filter(([key]) => {
        if (user.role === "admin") {
          return ["home", "students", "summary", "admin", "contact"].includes(key);
        }

        return key !== "admin";
      });

  return h(
    "div",
    null,

    h(
      "header",
      null,
      h(
        "div",
        { className: "wrap bar" },

        h(
          "div",
          {
            className: "logo",
            onClick: () => go(user ? "home" : "admin")
          },
          h("i", null, "E"),
          "EduVoice"
        ),

        h(
          "nav",
          { className: open ? "open" : "" },

          ...navPages.map(([key, label]) =>
            h(
              "a",
              {
                key,
                href: `#${key}`,
                className: pg === key ? "on" : "",
                onClick: (e) => {
                  e.preventDefault();
                  go(key);
                }
              },
              label
            )
          ),

          user &&
            h(
              "button",
              {
                className: "btn s",
                onClick: logout
              },
              "Logout"
            )
        ),

        h(
          "div",
          { className: "tools" },
          h(
            "button",
            {
              className: "ib burger",
              "aria-label": "Toggle navigation",
              "aria-expanded": open,
              onClick: () => setOpen((previous) => !previous)
            },
            open ? "✕" : "☰"
          )
        )
      )
    ),

    h(
      "main",
      { key: `${pg}-${user?.role || "guest"}` },
      view
    ),

    tm &&
      h(
        "div",
        { className: "toast", role: "status" },
        tm
      ),

    // Login page lo footer avasaram ledu
    user &&
      h(
        "footer",
        null,
        h(
          "div",
          { className: "wrap" },
          h(
            "div",
            { className: "grid" },

            h(
              "div",
              null,
              h("b", null, "EduVoice"),
              h(
                "div",
                null,
                "A dynamic student feedback portal built with HTML, CSS and React."
              )
            ),

            h(
              "div",
              null,
              h("b", null, "Quick links"),
              ...navPages.map(([key, label]) =>
                h(
                  "a",
                  {
                    key,
                    href: `#${key}`,
                    onClick: (e) => {
                      e.preventDefault();
                      go(key);
                    }
                  },
                  label
                )
              )
            ),

            h(
              "div",
              null,
              h("b", null, "Contact"),
              h("div", null, "feedback@eduvoice.edu"),
              h("div", null, "Vijayawada, Andhra Pradesh")
            )
          ),

          h("center", null, "© 2026 EduVoice.")
        )
      )
  );
}