<%_ if (hasElement) { _%>
import Vue from "vue";
import Element from "element-ui";

Vue.use(Element);

let id = 0;

const createElm = function() {
  const elm = document.createElement("div");
  elm.id = "app" + ++id;
  document.body.appendChild(elm);
  return elm;
};

/**
 * destroy vm
 * @param  {Object} vm
 */
export function destroyVM(vm) {
  vm.$destroy && vm.$destroy();
  vm.$el && vm.$el.parentNode && vm.$el.parentNode.removeChild(vm.$el);
}

/**
 * create a Vue object
 * @param  {Object|String}  Compo   component configuration, may carry template directly
 * @param  {Boolean=false} mounted if add it to DOM or not
 * @return {Object} vm
 */
export function createVue(Compo, mounted = false) {
  if (Object.prototype.toString.call(Compo) === "[object String]") {
    Compo = { template: Compo };
  }
  return new Vue(Compo).$mount(mounted === false ? null : createElm());
}

/**
 * create a testing component object
 * @link http://vuejs.org/guide/unit-testing.html#Writing-Testable-Components
 * @param  {Object}  Compo          - component object
 * @param  {Object}  propsData      - props data
 * @param  {Boolean=false} mounted  - if add it to DOM or not
 * @return {Object} vm
 */
export function createTest(Compo, propsData = {}, mounted = false) {
  if (propsData === true || propsData === false) {
    mounted = propsData;
    propsData = {};
  }
  const elm = createElm();
  const Ctor = Vue.extend(Compo);
  return new Ctor({ propsData }).$mount(mounted === false ? null : elm);
}

/**
 * trigger an event
 * mouseenter, mouseleave, mouseover, keyup, change, click etc.
 * @param  {Element} elm
 * @param  {String} name
 * @param  {*} opts
 */
export function triggerEvent(elm, name, ...opts) {
  let eventName;

  if (/^mouse|click/.test(name)) {
    eventName = "MouseEvents";
  } else if (/^key/.test(name)) {
    eventName = "KeyboardEvent";
  } else {
    eventName = "HTMLEvents";
  }
  const evt = document.createEvent(eventName);
  evt.initEvent(name, ...opts);
  elm.dispatchEvent ? elm.dispatchEvent(evt) : elm.fireEvent("on" + name, evt);
  return elm;
}

/**
 * trigger “mouseup” & “mousedown” event
 * @param {Element} elm
 * @param {*} opts
 */
export function triggerClick(elm, ...opts) {
  triggerEvent(elm, "mousedown", ...opts);
  triggerEvent(elm, "mouseup", ...opts);
  return elm;
}

/**
 * trigger keydown event
 * @param {Element} elm
 * @param {keyCode} int
 */
export function triggerKeyDown(el, keyCode) {
  const evt = document.createEvent("Events");
  evt.initEvent("keydown", true, true);
  evt.keyCode = keyCode;
  el.dispatchEvent(evt);
}
<%_ } _%>
