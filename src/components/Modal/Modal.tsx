import { useEffect, type MouseEvent } from "react";
import css from "./Modal.module.css";
import { createPortal } from "react-dom";
import NoteForm, { type NoteFormValues } from "../NoteForm/NoteForm";

interface ModalProps {
  onClose: () => void;
  onCreateNote: (note: NoteFormValues) => Promise<void>;
}

const Modal = ({ onClose, onCreateNote }: ModalProps) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [onClose]);
  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <>
      <div
        className={css.backdrop}
        role="dialog"
        aria-modal="true"
        onClick={handleBackdropClick}
      >
        <div className={css.modal}>
          {<NoteForm closeModal={onClose} onCreateNote={onCreateNote} />}
        </div>
      </div>
    </>,
    document.body,
  );
};

export default Modal;
