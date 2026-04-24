"use client";

import { useState, useEffect, useCallback } from "react";
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

  // Phase 2: 画像生成 state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  const handleGenerate = useCallback(
    async (file: File) => {
      if (!selectedTemplate) return;

      setScreen("result");
      setIsGenerating(true);
      setGeneratedImageUrl(null);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("templateId", selectedTemplate);

        const res = await fetch("/api/snap/generate/", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "生成に失敗しました");
        }

        setGeneratedImageUrl(data.imageUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "不明なエラーが発生しました");
      } finally {
        setIsGenerating(false);
      }
    },
    [selectedTemplate]
  );

  const handleReset = () => {
    setSelectedTemplate(null);
    setGeneratedImageUrl(null);
    setError(null);
    setScreen("landing");
  };

  const handleBack = () => {
    if (screen === "upload") setScreen("landing");
    if (screen === "result") {
      setGeneratedImageUrl(null);
      setError(null);
      setScreen("upload");
    }
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
          onUpload={handleGenerate}
        />
      );
    case "result":
      return (
        <Result
          subject={subject}
          initialTemplate={selectedTemplate}
          isGenerating={isGenerating}
          generatedImageUrl={generatedImageUrl}
          error={error}
          onBack={handleBack}
          onReset={handleReset}
        />
      );
  }
}
