import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { makeApp } from "../../src/app";

describe("GET /notes/:id (Ejercicio 3 - integracion)", () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(":memory:");
  });

  it("devuelve 200 y la nota cuando existe", async () => {
    const created = await request(app)
      .post("/notes")
      .send({ title: "Comprar pan", content: "Antes de las 20hs" });

    const res = await request(app).get(`/notes/${created.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(created.body);
  });

  it("devuelve 404 cuando el id no existe", async () => {
    const res = await request(app).get("/notes/999");

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "NotFound" });
  });
});

describe("PATCH /notes/:id (Ejercicio 4 - integracion)", () => {
  let app: ReturnType<typeof makeApp>;

  beforeEach(() => {
    app = makeApp(":memory:");
  });

  it("actualiza parcialmente una nota existente", async () => {
    const created = await request(app)
      .post("/notes")
      .send({ title: "Original", content: "Contenido" });

    const res = await request(app)
      .patch(`/notes/${created.body.id}`)
      .send({ title: "Actualizado" });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe("Actualizado");
    expect(res.body.content).toBe("Contenido");
  });

  it("actualiza varios campos a la vez", async () => {
    const created = await request(app)
      .post("/notes")
      .send({ title: "A", content: "B" });

    const res = await request(app)
      .patch(`/notes/${created.body.id}`)
      .send({ title: "C", content: "D", pinned: true });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ title: "C", content: "D", pinned: true });
  });

  it("devuelve 404 cuando el id no existe", async () => {
    const res = await request(app)
      .patch("/notes/999")
      .send({ title: "X" });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "NotFound" });
  });
});