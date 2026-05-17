import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useState } from "react";
import { createNote, deleteNote, fetchNotes } from "../../services/noteService";
import css from "./App.module.css";
import NoteList from "../NoteList/NoteList";
import SearchBox from "../SearchBox/SearchBox";
import { useDebouncedCallback } from "use-debounce";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import type { NoteFormValues } from "../NoteForm/NoteForm";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const App = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["Notes", query, page],
    queryFn: () => fetchNotes(query, page),

    placeholderData: keepPreviousData,
  });

  const onPageChange = (nextPage: number) => {
    setPage(nextPage);
  };
  const queryClient = useQueryClient();
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Notes"] });
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Notes"] });
    },
  });

  const notes = data?.notes ?? [];

  const totalPages = data?.totalPages ?? 0;

  const handleSearch = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setPage(1);
    },

    300,
  );
  const onDeleteNote = async (id: string) => {
    await deleteNoteMutation.mutateAsync(id);
  };

  const onCreateNote = async (note: NoteFormValues) => {
    await createNoteMutation.mutateAsync(note);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onChange={handleSearch} />

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        )}
        <button className={css.button} onClick={() => setIsOpenModal(true)}>
          Create note +
        </button>
      </header>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
      ) : notes.length > 0 ? (
        <NoteList notes={notes} onDeleteNote={onDeleteNote} />
      ) : (
        <p>No notes found.</p>
      )}
      {isOpenModal && (
        <Modal
          onCreateNote={onCreateNote}
          onClose={() => setIsOpenModal(false)}
        />
      )}
    </div>
  );
};

export default App;
