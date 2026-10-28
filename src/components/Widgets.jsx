
import React, { useState, useEffect } from "react";
const h = React.createElement;
// Custom hook to animate the count
function useCount(value, duration = 1000) {
    const target = Number(value) || 0;
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime;
        let frameId;
        function animate(timestamp) {
            if (startTime === undefined) {
                startTime = timestamp;
            }

            const progress = Math.min(
                (timestamp - startTime) / (Number(duration) || 1000),
                1
            );

            setCount(Math.round(target * progress));

            if (progress < 1) {
                frameId = requestAnimationFrame(animate);
            }
        }

        frameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(frameId);
    }, [target, duration]);

    return count;
}
// Convert a date or timestamp into relative time
function ago(value) {
    if (value == null || value === "") return "";

    let date;

    if (typeof value === "number") {
        date = new Date(
            value < 1e12 ? value * 1000 : value
        );
    } else {
        date = new Date(value);
    }

    if (Number.isNaN(date.getTime())) {
        return String(value);
    }

    const seconds = Math.max(
        0,
        Math.floor((Date.now() - date.getTime()) / 1000)
    );

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

    return date.toLocaleDateString();
}

// Statistics card
export function Stat({ label, v, d, suf }) {
    const c = useCount(v, d);

    return h(
        "div",
        { className: "card stat" },
        h("b", null, c + (suf || "")),
        label
    );
}

// Bar chart
export function Bars({ data }) {
    return h(
        "div",
        null,
        data.map((x) =>
            h(
                "div",
                { className: "brow", key: x.s },
                h("span", null, x.s),
                h(
                    "div",
                    { className: "meter" },
                    h("span", {
                        style: { width: x.r * 20 + "%" }
                    })
                ),
                h("b", null, x.r.toFixed(1))
            )
        )
    );
}
// Rating distribution
export function Dist({ fb }) {
    const t = fb.length || 1;

    return h(
        "div",
        null,
        [5, 4, 3, 2, 1].map((n) => {
            const c = fb.filter((f) => f.r === n).length;

            return h(
                "div",
                { className: "brow", key: n },
                h("span", null, n + " ★"),
                h(
                    "div",
                    { className: "meter" },
                    h("span", {
                        style: { width: (c / t) * 100 + "%" }
                    })
                ),
                h("b", null, c)
            );
        })
    );
}

// Feedback comments
export function Comments({ fb, n }) {
    return h(
        "div",
        null,
        fb.slice(0, n).map((f) =>
            h(
                "div",
                { className: "cm", key: f.id },
                h("b", null, f.name),
                " · ",
                h("span", { className: "pill" }, f.s),
                h("div", null, "“" + f.text + "”"),
                h(
                    "small",
                    null,
                    "★".repeat(Number(f.r) || 0) +
                    " · " +
                    ago(f.t)
                )
            )
        )
    );
}
