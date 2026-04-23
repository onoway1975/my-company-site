"use client";

import { useState, useEffect } from "react";
import type { Subject } from "../data/templates";
import Landing from "./Landing";
import Upload from "./Upload";
import Result from "./Result";

type Screen = "landing" | "upload" | "result";

export default function SnapClient() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [subject, setSubject] = useState<Subject>(() => {
    try {
      return (localStorage.getItem("snap_subject") as Subject) || "dog";
    } catch {
      return "dog";
    }
  });
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Hide global header/footer via DOM
  useEffect(() => {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    if (header) header.style.setProperty("display", "none", "important");
    if (footer) footer.style.setProperty("display", "none", "important");
    return () => {
      if (header) header.style.removeProperty("display");
      if (footer) footer.style.removeProperty("display");
    };
  }, []);

  // Scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [screen]);

  // Persist subject
  useEffect(() => {
    try {
      localStorage.setItem("snap_subject", subject);
    } catch {}
  }, [subject]);

  const handlePick = (s: Subject, templateId: string) => {
    setSubject(s);
    setSelectedTemplate(templateId);
    setScreen("upload");
  };

  const handleUpload = () => {
    setScreen("result");
  };

  const handleReset = () => {
    setSelectedTemplate(null);
    setScreen("landing");
  };

  const handleBack = () => {
    if (screen === "upload") setScreen("landing");
    if (screen === "result") setScreen("upload");
  };

  switch (screen) {
    case "landing":
      return <Landing onPick={handlePick} />;
    case "upload":
      return (
        <Upload
          subject={subject}
          templateId={selectedTemplate}
          onBack={handleBack}
          onUpload={handleUpload}
        />
      );
    case "result":
      return (
        <Result
          subject={subject}
          initialTemplate={selectedTemplate}
          onBack={handleBack}
          onReset={handleReset}
        />
      );
  }
}
