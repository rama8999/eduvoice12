

import React, { useState, useEffect } from "react";
import { PAGES, FB0, ST0 } from "./data.js";
import { useStore } from "./hooks.js";
import Home from "./pages/Home.jsx";
import Feedback from "./pages/Feedback.jsx";
import Students from "./pages/Students.jsx";
import Summary from "./pages/Summary.jsx";
import Admin from "./pages/Admin.jsx";
import Contact from "./pages/Contact.jsx";

const h = React.createElement;

const STUDENT_PAGES = [
  "home",
  "students",
  "feedback",
  "summary",
  "contact",
];

const ADMIN_PAGES = [
  "home",
  "students",
  "feedback",
  "summary",
  "admin",
  "contact",
];

const PAGE_LABELS = {
  home: "Home",
  students: "Students",
  feedback: "Feedback",
  summary: "Summary",
  admin: "Admin",
  contact: "Contact",
};

function getSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("ev-user")) || null;
  } catch {
    return null;
  }
}

function getPage(user) {
  if (!user) return "admin";

  const hash = window.location.hash.slice(1);
  const allowedPages =
    user.role === "admin" ? ADMIN_PAGES : STUDENT_PAGES;

  return allowedPages.includes(hash)
    ? hash
    : user.role === "admin"
      ? "admin"
      : "students";
}

export default function App() {
  const [user, setUser] = useState(getSavedUser);

  const [pg, setPg] = useState(() => getPage(getSavedUser()));
  const [open, setOpen] = useState(false);
  const [tm, setTm] = useState(null);

  const [fb, setFb] = useStore("ev-fb", FB0);
  const [st, setSt] = useStore("ev-st", ST0);

  useEffect(() => {
    const handleHash = () => {
      const currentUser = getSavedUser();
      const nextPage = getPage(currentUser);

      setPg(nextPage);
      setOpen(false);

      const allowedPages =
        currentUser?.role === "admin"
          ? ADMIN_PAGES
          : STUDENT_PAGES;

      if (!currentUser) {
        if (window.location.hash !== "#admin") {
          window.location.hash = "admin";
        }
      } else if (
        !allowedPages.includes(window.location.hash.slice(1))
      ) {
        window.location.hash = nextPage;
      }
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

    const allowedPages =
      user?.role === "admin" ? ADMIN_PAGES : STUDENT_PAGES;

    if (user && !allowedPages.includes(page)) {
      toast("You do not have access to this page");
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
    setPg("admin");
    window.location.hash = "admin";
    setOpen(false);

    toast("Logged out successfully");
    window.scrollTo(0, 0);
  };

  const add = (feedback) => {
    setFb((previous) => [
      {
        ...feedback,
        id: Date.now(),
        t: Date.now(),
      },
      ...previous,
    ]);

    toast("Feedback submitted successfully!");

    window.location.hash = "summary";
    setPg("summary");
    setOpen(false);
    window.scrollTo(0, 0);
  };

  const del = (id) => {
    setFb((previous) =>
      previous.filter((item) => item.id !== id)
    );

    toast("Feedback deleted");
  };

  const reset = () => {
    setFb(FB0);
    setSt(ST0);
    toast("Demo data restored");
  };

  let view;

  if (!user) {
    view = h(Admin, {
      fb,
      del,
      reset,
      onLogin: handleLogin,
      loggedIn: false,
    });
  } else if (user.role === "student") {
    const studentPages = {
      home: h(Home, { go, fb }),

      students: h(Students, {
        st,
        setSt,
        toast,
        user,
      }),

      feedback: h(Feedback, {
        add,
        user,
      }),

      summary: h(Summary, {
        fb,
        user,
      }),

      contact: h(Contact, {
        toast,
        user,
      }),
    };

    view = studentPages[pg] || studentPages.students;
  } else if (user.role === "admin") {
    const adminPages = {
      home: h(Home, { go, fb }),

      students: h(Students, {
        st,
        setSt,
        toast,
        user,
      }),

      // Admin can also open and submit the Feedback form
      feedback: h(Feedback, {
        add,
        user,
      }),

      summary: h(Summary, {
        fb,
        user,
      }),

      admin: h(Admin, {
        fb,
        del,
        reset,
        onLogin: handleLogin,
        onLogout: logout,
        loggedIn: true,
      }),

      contact: h(Contact, {
        toast,
        user,
      }),
    };

    view = adminPages[pg] || adminPages.admin;
  } else {
    view = h(Admin, {
      fb,
      del,
      reset,
      onLogin: handleLogin,
      loggedIn: false,
    });
  }

  // Feedback is included in the Admin and Student navigation
  const navPages = !user
    ? [["admin", "Login"]]
    : (user.role === "admin" ? ADMIN_PAGES : STUDENT_PAGES).map(
        (key) => {
          const existingPage = PAGES.find(
            (page) => page[0] === key
          );

          return [
            key,
            existingPage?.[1] || PAGE_LABELS[key] || key,
          ];
        }
      );

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
            onClick: () => go(user ? "home" : "admin"),
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
                },
              },
              label
            )
          ),

          user &&
            h(
              "button",
              {
                className: "btn s",
                onClick: logout,
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
              onClick: () => setOpen((previous) => !previous),
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
                    },
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
