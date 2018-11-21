import { mount } from "@vue/test-utils";
import App from "@/App";
import HelloWorld from "@/components/HelloWorld.vue";

describe("App.vue", () => {
  let wrapper, vm;

  beforeEach(() => {
    wrapper = mount(App);
    vm = wrapper.vm;
  });

  it("img exists", () => {
    expect(wrapper.findAll("img").exists()).to.equal(true);
  });

  it("div exists", () => {
    expect(wrapper.findAll("div").exists()).to.equal(true);
  });

  it("HelloWorld exists", () => {
    expect(wrapper.find(HelloWorld).exists()).to.equal(true);
  });
});
