import { mount } from "@vue/test-utils";
import Counter from "@/components/Counter.vue";
import Vue from "vue";
import { expect } from "chai";

describe("Counter.vue", () => {
  const wrapper = mount(Counter);

  it("render marker", () => {
    expect(wrapper.html()).to.contain('<span class="count">0</span>');
  });

  it("button", () => {
    expect(wrapper.contains("button")).to.equal(true);
  });

  it("increment", () => {
    expect(wrapper.vm.count).to.equal(0);
    const button = wrapper.find("button");
    button.trigger("click");
    expect(wrapper.vm.count).to.equal(1);
  });

  it("will time out", () => {
    Vue.nextTick(() => {
      expect(true).to.equal(true);
    });
  });

  it("will catch the error using a promise", () => {
    return Vue.nextTick().then(function() {
      expect(true).to.equal(true);
    });
  });
});
