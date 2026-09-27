import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";
import { makeApp } from "../../src/app";

describe("GET /notes/:id (Ejercicio 3 - integracion", () => {
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
