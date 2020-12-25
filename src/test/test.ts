import { expect } from "chai";
import { createServer } from "./example_server";
import { request } from "../request";

describe("@blueshit", function () {
  const { url, server } = createServer();

  after(async function () {
    server.close();
  });

  it("GET /text text=true", async function () {
    const res = await request({ url: url + "/text", text: true });
    expect(res.body).to.equal("GET /text");
  });

  it("GET /text?a=123&b=456 text=true", async function () {
    const res = await request({ url: url + "/text?a=123&b=456", text: true });
    expect(res.body).to.equal("GET /text?a=123&b=456");
  });

  it("GET /text?a=123 qs={b:456} text=true", async function () {
    const res = await request({ url: url + "/text?a=123", qs: { b: 456 }, text: true });
    expect(res.body).to.equal("GET /text?a=123&b=456");
  });

  it("POST /body?a=123 qs={b:456} body={c:789}", async function () {
    const res = await request({ method: "post", url: url + "/post?a=123", qs: { b: 456 }, body: { c: 789 } });
    expect(Buffer.isBuffer(res.body)).to.be.true;
    expect(res.body.toString()).to.equal(
      JSON.stringify({ method: "POST", url: "/post?a=123&b=456", body: JSON.stringify({ c: 789 }) }),
    );
  });

  it("POST /body?a=123 qs={b:456} body={c:789} json=true", async function () {
    const res = await request({
      method: "post",
      url: url + "/post?a=123",
      qs: { b: 456 },
      body: { c: 789 },
      json: true,
    });
    expect(res.body).to.deep.equal({ method: "POST", url: "/post?a=123&b=456", body: JSON.stringify({ c: 789 }) });
  });

  it("POST /body?a=123 qs={b:456} body=Buffer.from('abc') json=true", async function () {
    const res = await request({
      method: "post",
      url: url + "/post?a=123",
      qs: { b: 456 },
      body: Buffer.from("abc"),
      json: true,
    });
    expect(res.body).to.deep.equal({ method: "POST", url: "/post?a=123&b=456", body: "abc" });
  });

  it("timeout", async function () {
    try {
      await request({
        url: url + "/text",
        text: true,
        timeout: 1,
      });
      throw new Error("test no throw timeout Error");
    } catch (error) {
      expect(error).to.equal("timeout");
    }
  });

  it("https", async function () {
    this.timeout(10000);
    const res = await request({
      url: "https://github.com/",
      text: true,
    });
    expect(res.body).to.includes("github");
  });
});
