import Vue from "vue";
import hello from "@/components/Demo.vue";
import { expect } from "chai";

describe("hello", () => {
  it("hello world", () => {
    var vm = new Vue(hello).$mount();
    expect(vm.title).to.equal("hello world");
  });
});
