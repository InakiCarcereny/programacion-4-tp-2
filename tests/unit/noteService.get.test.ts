import { beforeEach, describe, expect, it } from "vitest";
import { createDb } from "../../src/db/connection";
import { SqliteNoteRepository } from "../../src/repositories/NoteRepository";
import { NoteServiceImpl } from "../../src/services/NoteService";

describe("NoteService - (Ejercicio 3)", () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(":memory:");
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it("devuelve la nota cuando el id existe", () => {
    const created = service.createNote({
      title: "Comprar pan",
      content: "Antes de las 20hs",
    });

    const found = service.getNote(created.id);

    expect(found).toEqual(created);
  });

  it("devuelve undefined cuando el id no existe", () => {
    const found = service.getNote(999);

    expect(found).toBeUndefined();
  });
});
