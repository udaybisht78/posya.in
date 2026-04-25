"use client";

import { X, HelpCircle, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

interface QuestionsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  questions: any[];
  productName: string;
}

export default function QuestionsDrawer({ isOpen, onClose, questions, productName }: QuestionsDrawerProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className="pdrawer-overlay" />
      <div className="pdrawer">

        {/* Header */}
        <div className="pdrawer-header">
          <div className="pdrawer-header-left">
            <div className="pdrawer-header-icon" style={{ background: "rgba(203,136,54,0.1)" }}>
              <HelpCircle size={18} style={{ color: "#cb8836" }} />
            </div>
            <div>
              <h2 className="pdrawer-title">FAQs</h2>
              <p className="pdrawer-subtitle">{productName}</p>
            </div>
          </div>
          <button onClick={onClose} className="pdrawer-close-btn"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="pdrawer-body">
          {(!questions || questions.length === 0) ? (
            <div className="pdrawer-empty">
              <HelpCircle size={40} style={{ color: "rgba(203,136,54,0.25)" }} />
              <p className="pdrawer-empty-title">No Questions Yet</p>
              <p className="pdrawer-empty-sub">No FAQs have been added for this product.</p>
            </div>
          ) : (
            <div className="pdrawer-qa-list">
              {questions.map((q: any, idx: number) => (
                <div key={q.id || idx} className="pdrawer-qa-item">
                  <button
                    className="pdrawer-qa-btn"
                    onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                  >
                    <span>{q.title}</span>
                    <ChevronDown
                      size={17}
                      className="pdrawer-qa-chevron"
                      style={{ transform: openIdx === idx ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", color: "#cb8836", flexShrink: 0 }}
                    />
                  </button>
                  {openIdx === idx && q.description && (
                    <div className="pdrawer-qa-answer"
                      dangerouslySetInnerHTML={{ __html: q.description }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}