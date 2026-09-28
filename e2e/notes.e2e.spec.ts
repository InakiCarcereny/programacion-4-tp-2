import { test, expect } from '@playwright/test';
import request from 'supertest';
import { resetAndSeed } from './helpers';

test.describe('Flujo E2E de notas (Ejercicio 7, con supertest)', () => {
  test('flujo completo: listar, leer, crear, modificar y borrar', async () => {
    const baseURL = test.info().project.use.baseURL!;
    const { created: sembradas } = await resetAndSeed(baseURL);
    const [pan, dentista] = sembradas;

    const list = await request(baseURL).get('/notes');
    expect(list.status).toBe(200);
    expect(list.body).toHaveLength(2);
    expect(list.body.map((n: { id: number }) => n.id)).toEqual([pan.id, dentista.id]);

    const una = await request(baseURL).get(`/notes/${pan.id}`);
    expect(una.status).toBe(200);
    expect(una.body).toMatchObject({ title: 'Comprar pan', pinned: false });

    const creada = await request(baseURL)
      .post('/notes')
      .send({ title: 'Sacar al perro', content: 'Antes de las 17hs' });
    expect(creada.status).toBe(201);
    const nueva = creada.body;
    expect(nueva.pinned).toBe(false);

    const parcheada = await request(baseURL)
      .patch(`/notes/${nueva.id}`)
      .send({ title: 'Sacar al perro (URGENTE)' });
    expect(parcheada.status).toBe(200);
    expect(parcheada.body).toMatchObject({
      title: 'Sacar al perro (URGENTE)',
      content: 'Antes de las 17hs'
    });

    const borrada = await request(baseURL).delete(`/notes/${dentista.id}`);
    expect(borrada.status).toBe(204);
    expect((await request(baseURL).get(`/notes/${dentista.id}`)).status).toBe(404);

    const listaFinal = await request(baseURL).get('/notes');
    expect(listaFinal.body.map((n: { id: number }) => n.id).sort()).toEqual(
      [pan.id, nueva.id].sort()
    );
  });

  test('caso de error: crear una nota sin title devuelve 400', async () => {
    const baseURL = test.info().project.use.baseURL!;
    await resetAndSeed(baseURL);

    const res = await request(baseURL).post('/notes').send({ content: 'Sin titulo' });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('ValidationError');

    const list = await request(baseURL).get('/notes');
    expect(list.body).toHaveLength(2);
  });
});
