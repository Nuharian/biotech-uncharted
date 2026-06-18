"use client";

import { useState } from "react";

// Same deterministic palette used on the public team card, so the admin
// preview matches what visitors will see.
const SKILL_COLORS = [
  { fg: "#40E0D0", bg: "rgba(64, 224, 208, 0.12)", border: "rgba(64, 224, 208, 0.45)" },
  { fg: "#7CA0FF", bg: "rgba(124, 160, 255, 0.12)", border: "rgba(124, 160, 255, 0.45)" },
  { fg: "#B07CFF", bg: "rgba(176, 124, 255, 0.12)", border: "rgba(176, 124, 255, 0.45)" },
  { fg: "#FF8FB1", bg: "rgba(255, 143, 177, 0.12)", border: "rgba(255, 143, 177, 0.45)" },
  { fg: "#FFC440", bg: "rgba(255, 196, 64, 0.12)", border: "rgba(255, 196, 64, 0.45)" },
  { fg: "#5FD98A", bg: "rgba(95, 217, 138, 0.12)", border: "rgba(95, 217, 138, 0.45)" },
  { fg: "#FF9D6C", bg: "rgba(255, 157, 108, 0.12)", border: "rgba(255, 157, 108, 0.45)" },
];

function colorForSkill(skill: string) {
  let hash = 0;
  for (let i = 0; i < skill.length; i++) {
    hash = (hash * 31 + skill.charCodeAt(i)) >>> 0;
  }
  return SKILL_COLORS[hash % SKILL_COLORS.length];
}

function parse(value: string): string[] {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export default function SkillsInput({
  name = "bio",
  defaultValue = "",
}: {
  name?: string;
  defaultValue?: string;
}) {
  const [skills, setSkills] = useState<string[]>(parse(defaultValue));
  const [draft, setDraft] = useState("");

  function addSkill(raw: string) {
    // Allow pasting several comma-separated skills at once.
    const parts = parse(raw);
    if (parts.length === 0) return;
    setSkills((prev) => {
      const next = [...prev];
      for (const p of parts) {
        if (!next.some((s) => s.toLowerCase() === p.toLowerCase())) next.push(p);
      }
      return next;
    });
    setDraft("");
  }

  function removeSkill(index: number) {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(draft);
    } else if (e.key === "Backspace" && draft === "" && skills.length > 0) {
      removeSkill(skills.length - 1);
    }
  }

  return (
    <div>
      {/* Hidden field keeps the existing comma-separated storage format intact */}
      <input type="hidden" name={name} value={skills.join(", ")} />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          alignItems: "center",
          padding: "0.6rem 0.7rem",
          borderRadius: "var(--border-radius)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          background: "rgba(2, 11, 26, 0.9)",
          minHeight: "48px",
        }}
      >
        {skills.map((skill, i) => {
          const c = colorForSkill(skill);
          return (
            <span
              key={`${skill}-${i}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: c.fg,
                background: c.bg,
                border: `1px solid ${c.border}`,
                padding: "0.25rem 0.3rem 0.25rem 0.7rem",
                borderRadius: "999px",
                lineHeight: 1.3,
              }}
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(i)}
                aria-label={`Remove ${skill}`}
                title={`Remove ${skill}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
                  color: c.fg,
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  lineHeight: 1,
                  padding: 0,
                }}
              >
                ×
              </button>
            </span>
          );
        })}

        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => addSkill(draft)}
          placeholder={skills.length === 0 ? "Type a skill, then press Enter…" : "Add another…"}
          style={{
            flex: 1,
            minWidth: "160px",
            border: "none",
            outline: "none",
            background: "transparent",
            color: "white",
            fontSize: "0.9rem",
            padding: "0.25rem",
          }}
        />
      </div>

      <small style={{ color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
        Type a skill and press <strong>Enter</strong> (or comma) to add it as a tag. Click <strong>×</strong> on a tag to remove it.
      </small>
    </div>
  );
}
