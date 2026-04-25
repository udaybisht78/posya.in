"use client";

import Image from "next/image";
import { X, Leaf } from "lucide-react";
import { useEffect } from "react";

interface IngredientsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ingredients: any[];
  productName: string;
}

export default function IngredientsDrawer({ isOpen, onClose, ingredients, productName }: IngredientsDrawerProps) {
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
              <Leaf size={18} style={{ color: "#cb8836" }} />
            </div>
            <div>
              <h2 className="pdrawer-title">Key Ingredients</h2>
              <p className="pdrawer-subtitle">{productName}</p>
            </div>
          </div>
          <button onClick={onClose} className="pdrawer-close-btn"><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="pdrawer-body">
          {(!ingredients || ingredients.length === 0) ? (
            <div className="pdrawer-empty">
              <Leaf size={40} style={{ color: "rgba(203,136,54,0.25)" }} />
              <p className="pdrawer-empty-title">No Ingredients Listed</p>
              <p className="pdrawer-empty-sub">This product has no ingredients added yet.</p>
            </div>
          ) : (
            <div className="pdrawer-ing-list">
              {ingredients.map((ing: any, idx: number) => (
                <div key={ing.id || idx}>
                  <div className="pdrawer-ing-row">
                    {ing.featured_image && (
                      <div className="pdrawer-ing-img">
                        <Image src={ing.featured_image} alt={ing.name || "Ingredient"} fill className="object-cover" />
                      </div>
                    )}
                    <div className="pdrawer-ing-text">
                      <h4 className="pdrawer-ing-name">{ing.name}</h4>
                      {ing.content && (
                        <div className="pdrawer-ing-desc" dangerouslySetInnerHTML={{ __html: ing.content }} />
                      )}
                    </div>
                  </div>
                  {idx < ingredients.length - 1 && <div className="pdrawer-divider" />}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </>
  );
}