import { beforeEach, describe, expect, it } from "vitest";
import { createDb } from "../../src/db/connection";
import { SqliteNoteRepository } from "../../src/repositories/NoteRepository";
import { NoteServiceImpl } from "../../src/services/NoteService";

describe("NoteService - (Ejercicio 2", () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(":memory:");
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it("devuelve una lista vacia cuando no hay notas", () => {
    expect(service.listNotes()).toEqual([]);
  });

  it("devuelve todas las notas creadas", () => {
    service.createNote({ title: "Comprar pan", content: "Antes de las 20hs" });
    service.createNote({
      title: "Llamar a Juan",
      content: "Por el proyecto",
      pinned: true,
    });

    const notes = service.listNotes();

    expect(notes).toHaveLength(2);
    expect(notes.map((n) => n.title)).toEqual(["Comprar pan", "Llamar a Juan"]);
  });
});
