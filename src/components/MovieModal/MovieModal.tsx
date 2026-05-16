// import { createPortal } from "react-dom";
// import type { Movie } from "../../types/movie";
// import css from "./MovieModal.module.css";

// const MovieModal = ({
//   movie,
//   onClose,
// }: {
//   movie: Movie;
//   onClose: () => void;
// }) => {
//   return createPortal(
//     <div className={css.backdrop} role="dialog" aria-modal="true">
//       <div className={css.modal}>
//         <button
//           className={css.closeButton}
//           aria-label="Close modal"
//           onClick={onClose}
//         >
//           &times;
//         </button>
//         <img
//           src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
//           alt={movie.title}
//           className={css.image}
//         />
//         <div className={css.content}>
//           <h2>{movie.title}</h2>
//           <p>{movie.overview}</p>
//           <p>
//             <strong>Release Date:</strong> {movie.release_date}
//           </p>
//           <p>
//             <strong>Rating:</strong> {movie.vote_average}/10
//           </p>
//         </div>
//       </div>
//     </div>,
//     document.getElementById("modal") || document.body,
//   );
// };

// export default MovieModal;

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Movie } from "../../types/movie";
import css from "./MovieModal.module.css";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}
const MovieModal = ({ movie, onClose }: MovieModalProps) => {
  // 1. Обробка натискання клавіші Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Блокуємо скрол сторінки, поки модалка відкрита
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      // Повертаємо скрол при закритті
      document.body.style.overflow = "auto";
    };
  }, [onClose]);

  // 2. Обробка кліку по бекдропу (фону)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Закриваємо лише якщо клікнули саме по backdrop, а не по його дітях
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick} // Додали обробник тут
    >
      <div className={css.modal}>
        <button
          className={css.closeButton}
          aria-label="Close modal"
          onClick={onClose}
        >
          &times;
        </button>
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
          alt={movie.title}
          className={css.image}
        />
        <div className={css.content}>
          <h2>{movie.title}</h2>
          <p>{movie.overview}</p>
          <p>
            <strong>Release Date:</strong> {movie.release_date}
          </p>
          <p>
            <strong>Rating:</strong> {movie.vote_average}/10
          </p>
        </div>
      </div>
    </div>,
    document.getElementById("modal") || document.body,
  );
};

export default MovieModal;
