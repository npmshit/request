import Benchmark from "@leizm/benchmark";
import { request, DEFAULT_HTTP_AGENT } from "../request";
import * as assert from "assert";
import * as otherRequest from "request";
import axios from "axios";

const url = "http://127.0.0.1:34569/text";
const ret = "GET /text";
const seconds = 60;
const delay = 10;
const concurrent = 500;
const b = new Benchmark({ title: "@blueshit/request Benchmark", concurrent, seconds, delay });

const report = { blueshit: { success: 0, fail: 0 }, request: { success: 0, fail: 0 }, axios: { success: 0, fail: 0 } };

b.addAsync("axios", async () => {
  try {
    const res = await axios.get(url, { httpAgent: DEFAULT_HTTP_AGENT });
    assert.equal(res.data, ret);
    report.axios.success++;
  } catch (err) {
    report.axios.fail++;
  }
})
  .addAsync("axios #default agent", async () => {
    try {
      const res = await axios.get(url);
      assert.equal(res.data, ret);
      report.axios.success++;
    } catch (err) {
      report.axios.fail++;
    }
  })
  .addCallback("request", done => {
    otherRequest(url, { agent: DEFAULT_HTTP_AGENT }, (err, res) => {
      if (err) {
        // console.log(err);
        report.request.fail++;
        return done();
      }
      try {
        assert.equal(res.body, ret);
        report.request.success++;
        return done();
      } catch (err) {
        // console.log(err);
        report.request.fail++;
        return done();
      }
    });
  })
  .addCallback("request #default agent", done => {
    otherRequest(url, (err, res) => {
      if (err) {
        // console.log(err);
        report.request.fail++;
        return done();
      }
      try {
        assert.equal(res.body, ret);
        report.request.success++;
        return done();
      } catch (err) {
        // console.log(err);
        report.request.fail++;
        return done();
      }
    });
  })
  .addAsync("@blueshit/request", async () => {
    try {
      const res = await request({ url, text: true });
      assert.equal(res.body, ret);
      report.blueshit.success++;
    } catch (err) {
      report.blueshit.fail++;
    }
  })
  .run()
  .then(r => {
    b.print(r);
    console.log(report);
  })
  .catch(console.log);
