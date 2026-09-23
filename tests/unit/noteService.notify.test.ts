import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createDb } from '../../src/db/connection';
import { SqliteNoteRepository } from '../../src/repositories/NoteRepository';
import { notify } from '../../src/services/notificationService';
import { NoteServiceImpl } from '../../src/services/NoteService';

vi.mock('../../src/services/notificationService');

describe('NotificationService (Ejercicio 6)', () => {
    let service: NoteServiceImpl;

    
    beforeEach(() => {
        vi.mocked(notify).mockClear()
        const db = createDb(':memory:');
        const repo = new SqliteNoteRepository(db);
        service = new NoteServiceImpl(repo);
    });


    it('si pinned es true, se llama a notify', () => {
        const note = service.createNote({ title: 'A', content: 'B', pinned: true });
        expect(notify).toHaveBeenCalledTimes(1);
        expect(notify).toHaveBeenCalledWith(note);
    });

    it('si pinned es false o no se indica, no se llama a notify', () => {
        const note = service.createNote({ title: 'A', content: 'B'});
        expect(notify).not.toHaveBeenCalled();
    });
});