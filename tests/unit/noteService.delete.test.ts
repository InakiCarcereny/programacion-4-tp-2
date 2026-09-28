import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { createDb } from '../../src/db/connection';

describe('NoteService - deleteNote (Ejercicio 5)', () => {
  let service: NoteServiceImpl;

  beforeEach(() => {
    const db = createDb(':memory:');
    const repo = new SqliteNoteRepository(db);
    service = new NoteServiceImpl(repo);
  });

  it('devuelve true y elimina la nota existente', () => {
    const note = service.createNote({ title: 'Comprar pan', content: 'Antes de las 20hs' });
    expect(service.deleteNote(note.id)).toBe(true);
    expect(service.listNotes()).toHaveLength(0);
  });

  it('no modifica las demás notas al borrar una', () => {
    const a = service.createNote({ title: 'A', content: 'B' });
    service.createNote({ title: 'C', content: 'D' });
    service.deleteNote(a.id);
    expect(service.listNotes().map(n => n.id)).not.toContain(a.id);
    expect(service.listNotes()).toHaveLength(1);
  });

  it('devuelve false si la nota no existe', () => {
    expect(service.deleteNote(999)).toBe(false);
  });

  it('borrar dos veces la misma nota: la segunda devuelve false', () => {
    const note = service.createNote({ title: 'A', content: 'B' });
    expect(service.deleteNote(note.id)).toBe(true);
    expect(service.deleteNote(note.id)).toBe(false);
  });
});
