import TemplateManager from "./template_manager";

describe("Template manager", () => {
  let templateManager: any;
  const data = {
    value: 1,
    input: "test",
    tags: [
      { id: 1, title: "first" },
      { id: 2, title: "second" },
      { id: 3, title: "third" },
    ],
  };
  beforeEach(() => {
    templateManager = TemplateManager();
  });

  test("Simple template rendering", () => {
    const template = `<h1>Count {{value}}</h1>{{if input}}<input type="text" value="{{input}}">{{endif}}`;
    expect(templateManager.renderTemplate(template, data)).toBe(
      `<h1>Count 1</h1><input type="text" value="test">`
    );
  });
  describe("Loop template rendering", () => {
    beforeEach(() => {
      document.body.innerHTML = "";
    });
    test("Invalid arguments", () => {
      const template = `
            <ul>
            {{for tags as item}}
                <li id="{{notitem.id}}">{{item.title}}</li>
            {{endfor}}
            </ul>
        `;
      const section = document.createElement("section");
      section.innerHTML = templateManager.replaceLoops(template, data);
      expect(section.querySelector("li")!.id).toBe("");
      expect(templateManager.replaceLoopVariables("", {}, "", 0, 0)).toBe("");
    });
    test("Simple loop", () => {
      const template = `
            <ul>
            {{for tags as item}}
                <li id="{{item.id}}">{{item.title}}</li>
            {{endfor}}
            </ul>
           `;
      const section = document.createElement("section");
      section.innerHTML = templateManager.replaceLoops(template, data);
      expect(section.getElementsByTagName("li").length).toBe(data.tags.length);
    });
    test("Conditional loop: Last Element", () => {
      const template = `
            <ul>
            {{for tags as item}}
                {{if IsLast}}
                    <li id="{{item.id}}">{{item.title}}</li>
                {{endif}}
            {{endfor}}
            </ul>
           `;
      const innerHTML = templateManager.replaceLoops(template, data);
      document.body.insertAdjacentHTML("afterbegin", innerHTML);
      expect(
        document.getElementById(`${data.tags[data.tags.length - 1].id}`)!
          .innerHTML
      ).toBe(`${data.tags[data.tags.length - 1].title}`);
      expect(
        document.getElementById(`${data.tags[data.tags.length - 2].id}`)
      ).toBeFalsy();
    });
    test("Conditional loop: not Last Element", () => {
      const template = `
            <ul>
            {{for tags as item}}
                {{if notIsLast}}
                    <li id="{{item.id}}">{{item.title}}</li>
                {{endif}}
            {{endfor}}
            </ul>
           `;
      const innerHTML = templateManager.replaceLoops(template, data);
      document.body.insertAdjacentHTML("afterbegin", innerHTML);
      expect(document.getElementById(`${data.tags[1].id}`)!.innerHTML).toBe(
        `${data.tags[1].title}`
      );
      expect(
        document.getElementById(`${data.tags[data.tags.length - 1].id}`)
      ).toBeFalsy();
    });
    test("Conditional loop: First Element", () => {
      const template = `
            <ul>
            {{for tags as item}}
                {{if IsFirst}}
                    <li id="{{item.id}}">{{item.title}}</li>
                {{endif}}
            {{endfor}}
            </ul>
           `;
      const innerHTML = templateManager.replaceLoops(template, data);
      document.body.insertAdjacentHTML("afterbegin", innerHTML);
      expect(document.getElementById(`${data.tags[0].id}`)!.innerHTML).toBe(
        `${data.tags[0].title}`
      );
      expect(
        document.getElementById(`${data.tags[data.tags.length - 1].id}`)
      ).toBeFalsy();
    });
    test("Conditional loop: not First Element", () => {
      const template = `
            <ul>
            {{for tags as item}}
                {{if notIsFirst}}
                    <li id="{{item.id}}">{{item.title}}</li>
                {{endif}}
            {{endfor}}
            </ul>
           `;
      const innerHTML = templateManager.replaceLoops(template, data);
      document.body.insertAdjacentHTML("afterbegin", innerHTML);
      expect(document.getElementById(`${data.tags[1].id}`)!.innerHTML).toBe(
        `${data.tags[1].title}`
      );
      expect(document.getElementById(`${data.tags[0].id}`)).toBeFalsy();
    });
    test("Conditional loop: Index Element", () => {
      const template = `
            <ul>
            {{for tags as item}}
                {{if Index 1}}
                    <li id="{{item.id}}">{{item.title}}</li>
                {{endif}}
            {{endfor}}
            </ul>
           `;
      const innerHTML = templateManager.replaceLoops(template, data);
      document.body.insertAdjacentHTML("afterbegin", innerHTML);
      expect(document.getElementById(`${data.tags[1].id}`)!.innerHTML).toBe(
        `${data.tags[1].title}`
      );
      expect(document.getElementById(`${data.tags[0].id}`)).toBeFalsy();
      expect(document.getElementById(`${data.tags[2].id}`)).toBeFalsy();
    });
    test("Conditional loop: not Index Element", () => {
      const template = `
            <ul>
            {{for tags as item}}
                {{if notIndex 1}}
                    <li id="{{item.id}}">{{item.title}}</li>
                {{endif}}
            {{endfor}}
            </ul>
           `;
      const innerHTML = templateManager.replaceLoops(template, data);
      document.body.insertAdjacentHTML("afterbegin", innerHTML);
      expect(document.getElementById(`${data.tags[0].id}`)!.innerHTML).toBe(
        `${data.tags[0].title}`
      );
      expect(document.getElementById(`${data.tags[2].id}`)!.innerHTML).toBe(
        `${data.tags[2].title}`
      );
      expect(document.getElementById(`${data.tags[1].id}`)).toBeFalsy();
    });
  });
});
