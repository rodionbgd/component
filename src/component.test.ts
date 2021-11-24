import Component from "./component";
import TemplateManager from "./template_manager";

type State = {
  value: number;
  input: string;
};

describe("Component testing", () => {
  let component: Component;
  beforeEach(() => {
    document.body.innerHTML = `<section id="app"></section>`;
    const template = `
        <h1>Count {{value}} {{input}}</h1>
        <input value="{{input}}">
        <button class="dec">-</button>
        <button class="inc">+</button>
        `;
    const app = document.getElementById("app") as HTMLElement;
    component = new Component<State>(app, template, {
      value: 50,
      input: "Hello",
    });
    component.elem.innerHTML = component.render();
  });
  test("Instantiating Component", () => {
    expect(component).toBeInstanceOf(Component);
    expect(component).toBeInstanceOf(TemplateManager);
    expect(component.state).toStrictEqual({ value: 50, input: "Hello" });
  });
  test("Subscribe to events", () => {
    const increaseCounterMock = jest.fn();
    const decreaseCounterMock = jest.fn();
    component.events = {
      "click@button.dec": decreaseCounterMock,
      "click@button.inc": increaseCounterMock,
    };
    component.subscribeToEvents();
    component.elem
      .querySelector("button.dec")!
      .dispatchEvent(new Event("click"));
    expect(decreaseCounterMock).toHaveBeenCalled();
    component.elem
      .querySelector("button.inc")!
      .dispatchEvent(new Event("click"));
    expect(increaseCounterMock).toHaveBeenCalled();
  });
  test("Setting state", () => {
    const renderMock = jest.spyOn(component, "render");
    const value = Math.random();
    const newState = {
      value,
      input: `${value + 1}`,
    };
    component.setState(newState);
    expect(renderMock).toHaveBeenCalled();
    expect(component.state).toStrictEqual(newState);
  });
  test("Mounting", () => {
    const log = jest.spyOn(console, "log");
    const group = jest.spyOn(console, "group");
    component.onMount(component.elem);
    expect(group).toHaveBeenCalledWith(`${component.elem.id}`);
    Object.entries(component.state!).forEach(([key, value]) => {
      expect(log).toHaveBeenCalledWith(`${key}: ${value}`);
    });
  });
});
