import { describe, it, expect, beforeEach } from 'vitest';
import { NoteServiceImpl } from '../../src/services/NoteService';
import type { NoteRepository } from '../../src/repositories/NoteRepository';
import type { Note, NewNote, NotePatch } from '../../src/models/Note';

class FakeNoteRepository implements NoteRepository {
  private notes: Note[] = [];
  private nextId = 1;

  create(data: NewNote): Note {
    const now = new Date().toISOString();
    const note: Note = {
      id: this.nextId++,
      title: data.title,
      content: data.content,
      pinned: data.pinned ?? false,
      createdAt: now,
      updatedAt: now,
    };
    this.notes.push(note);
    return note;
  }

  findAll(): Note[] {
    return [...this.notes];
  }

  findById(id: number): Note | undefined {
    return this.notes.find((n) => n.id === id);
  }

  update(id: number, patch: NotePatch): Note | undefined {
    const existing = this.findById(id);
    if (!existing) return undefined;
    const merged = { ...existing, ...patch, updatedAt: new Date().toISOString() };
    this.notes = this.notes.map((n) => (n.id === id ? merged : n));
    return merged;
  }

  delete(id: number): boolean {
    const before = this.notes.length;
    this.notes = this.notes.filter((n) => n.id !== id);
    return this.notes.length < before;
  }

  clear(): void {
    this.notes = [];
  }
}

describe('NoteService.updateNote', () => {
  let repo: FakeNoteRepository;
  let service: NoteServiceImpl;

  beforeEach(() => {
    repo = new FakeNoteRepository();
    service = new NoteServiceImpl(repo);
  });

  it('actualiza solo el título y deja content/pinned igual', () => {
    const created = repo.create({ title: 'Original', content: 'Contenido original' });

    const updated = service.updateNote(created.id, { title: 'Nuevo título' });

    expect(updated?.title).toBe('Nuevo título');
    expect(updated?.content).toBe('Contenido original');
    expect(updated?.pinned).toBe(false);
  });

  it('actualiza solo el contenido y deja el título igual', () => {
    const created = repo.create({ title: 'Título', content: 'Viejo' });

    const updated = service.updateNote(created.id, { content: 'Nuevo contenido' });

    expect(updated?.content).toBe('Nuevo contenido');
    expect(updated?.title).toBe('Título');
  });

  it('permite actualizar varios campos a la vez', () => {
    const created = repo.create({ title: 'A', content: 'B' });

    const updated = service.updateNote(created.id, { title: 'C', content: 'D', pinned: true });

    expect(updated).toMatchObject({ title: 'C', content: 'D', pinned: true });
  });

  it('actualiza updatedAt pero no createdAt', async () => {
    const created = repo.create({ title: 'A', content: 'B' });
    await new Promise((r) => setTimeout(r, 5));

    const updated = service.updateNote(created.id, { title: 'C' });

    expect(updated?.createdAt).toBe(created.createdAt);
    expect(updated?.updatedAt).not.toBe(created.createdAt);
  });

  it('devuelve undefined si el id no existe', () => {
    const result = service.updateNote(999, { title: 'No existe' });
    expect(result).toBeUndefined();
  });
});