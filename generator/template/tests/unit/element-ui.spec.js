<%_ if (hasElement) { _%>
import {
  createTest,
  createVue,
  destroyVM,
  triggerEvent,
  triggerClick,
  triggerKeyDown
} from "./util";
import Button from "element-ui/packages/button";
import { expect } from "chai";

describe("Element-UI", () => {
  let vm;
  afterEach(() => {
    destroyVM(vm);
  });

  it("Button create #1", () => {
    vm = createTest(Button);
    let buttonElm = vm.$el;
    expect(buttonElm.classList.contains("el-button--primary")).to.be.false;
  });
  it("Button create #2", () => {
    vm = createTest(Button, false, false);
    let buttonElm = vm.$el;
    expect(buttonElm.classList.contains("el-button--primary")).to.be.false;
  });
  it("Button create #3", () => {
    vm = createTest(Button, true, false);
    let buttonElm = vm.$el;
    expect(buttonElm.classList.contains("el-button--primary")).to.be.false;
  });
  it("Button create", () => {
    vm = createTest(
      Button,
      {
        type: "primary",
        icon: "el-icon-search",
        nativeType: "submit"
      },
      true
    );
    let buttonElm = vm.$el;
    expect(buttonElm.classList.contains("el-button--primary")).to.be.true;
    expect(buttonElm.querySelector(".el-icon-search")).to.be.ok;
    expect(buttonElm.getAttribute("type")).to.be.equal("submit");
  });
  it("Button loading disabled", () => {
    vm = createTest(
      Button,
      {
        loading: true,
        disabled: true,
        size: "medium",
        plain: true,
        round: true,
        circle: true
      },
      true
    );
    let buttonElm = vm.$el;
    expect(buttonElm.classList.contains("is-loading")).to.be.true;
    expect(buttonElm.querySelector(".el-icon-loading")).to.be.ok;
    expect(buttonElm.classList.contains("is-disabled")).to.be.true;
    expect(buttonElm.classList.contains("el-button--medium")).to.be.true;
    expect(buttonElm.classList.contains("is-plain")).to.be.true;
    expect(buttonElm.classList.contains("is-round")).to.be.true;
    expect(buttonElm.classList.contains("is-circle")).to.be.true;
  });
  it("Button click", done => {
    let result;
    vm = createVue(
      {
        template: `
        <el-button @click="handleClick"></el-button>
      `,
        methods: {
          handleClick(evt) {
            result = evt;
          }
        }
      },
      true
    );
    vm.$el.click();

    setTimeout(_ => {
      expect(result).to.exist;
      done();
    }, 20);
  });
  it("Tooltip create", done => {
    vm = createVue(`
      <el-tooltip ref="tooltip" content="提示文字">
        <button>click</button>
      </el-tooltip>`);

    vm.$nextTick(_ => {
      expect(vm.$refs.tooltip.popperVM.$el).to.have.property(
        "textContent",
        "提示文字"
      );
      done();
    });
  });
  it("Tooltip reference element focus", done => {
    vm = createVue(`
    <el-tooltip ref="tooltip" content="提示文字">
      <button>click</button>
    </el-tooltip>`);
    const tooltip = vm.$refs.tooltip;
    vm.$nextTick(_ => {
      triggerEvent(tooltip.$el, "focus");
      setTimeout(() => {
        expect(tooltip.showPopper).to.be.true;
        expect(tooltip.focusing).to.be.true;
        triggerEvent(tooltip.$el, "blur");
        setTimeout(() => {
          expect(tooltip.showPopper).to.be.false;
          expect(tooltip.focusing).to.be.false;
          done();
        }, 300);
      }, 100);
    });
  });
  it("Dropdown create", done => {
    vm = createVue(
      {
        template: `
        <el-dropdown ref="dropdown">
          <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-caret-bottom el-icon-right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="dropdown-test-creat">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      `
      },
      true
    );
    let dropdown = vm.$refs.dropdown;
    dropdown.fireEvent = (str, evt) => {};

    triggerEvent(dropdown, "keydown");
    setTimeout(_ => {
      expect(dropdown.visible).to.be.false;
      done();
    }, 400);
  });
  it("InputNumber decrease", done => {
    vm = createVue(
      {
        template: `
        <el-input-number v-model="value" ref="input">
        </el-input-number>
      `,
        data() {
          return {
            value: 5
          };
        }
      },
      true
    );

    let input = vm.$el.querySelector("input");
    let btnDecrease = vm.$el.querySelector(".el-input-number__decrease");

    triggerEvent(btnDecrease, "mousedown");
    triggerClick(document, "mouseup");

    vm.$nextTick(_ => {
      expect(vm.value).to.be.equal(4);
      expect(input.value).to.be.equal("4");
      done();
    });
  });
  it("Dropdown triggerElm keydown", done => {
    vm = createVue(
      {
        template: `
        <el-dropdown ref="dropdown">
          <span class="el-dropdown-link">
            下拉菜单<i class="el-icon-caret-bottom el-icon-right"></i>
          </span>
          <el-dropdown-menu slot="dropdown" class="dropdown-test-creat">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      `
      },
      true
    );
    let dropdown = vm.$refs.dropdown;
    let dropdownElm = dropdown.$el;
    let triggerElm = dropdownElm.children[0];
    triggerKeyDown(triggerElm, 13); // enter
    setTimeout(() => {
      expect(dropdown.visible).to.be.true;
      triggerKeyDown(triggerElm, 27); // esc
      setTimeout(() => {
        expect(dropdown.visible).to.be.false;
        done();
      }, 300);
    }, 400);
  });
});
<%_ } _%>
