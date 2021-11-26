import Todo from "./todo";
import Component from "./component";
import TemplateManager from "./template_manager";

describe("Todo testing", () => {
    let template: string;
    let todo: Todo;
    let app: HTMLElement;
    beforeEach(() => {
        document.body.innerHTML = `<section id="app"></section>`;
        template = `
       <h1>Todo list:
       {{for tasks as task}}
            <span>{{task}}
            {{if notIsLast}}
            ,
            {{endif}}
            </span>
       {{endfor}}
       </h1>   
       <section>
            <input id="todo" value="{{input}}"/>
            <button class="add">+</button>
       </section>
       {{for tasks as task}}
            <section>
                <span>{{task}}</span><button class="remove">-</button>
            </section>
       {{endfor}}
       `;
        app = <HTMLElement>document.getElementById("app");
        todo = new Todo(app, template, {
            tasks: ["shopping"],
            input: "shopping",
        });
    });
    test("Instantiating Todo", () => {
        expect(todo).toBeInstanceOf(Todo);
        expect(todo).toBeInstanceOf(Component);
        expect(todo).toBeInstanceOf(TemplateManager);
        expect(todo.state).toStrictEqual({
            tasks: ["shopping"],
            input: "shopping",
        });
    });
    test("Subscribing to events", () => {
        const addTaskMock = jest.fn();
        const removeTaskMock = jest.fn();
        todo.events = {
            "click@button.add": addTaskMock,
            "click@button.remove.all": removeTaskMock,
        };
        todo.elem.innerHTML = todo.render();
        todo.subscribeToEvents();
        todo.elem.querySelector("button.add")!.dispatchEvent(new MouseEvent("click", {bubbles: true}));
        expect(addTaskMock).toHaveBeenCalled();
        todo.elem.querySelector("button.remove")!.dispatchEvent(new MouseEvent("click"));
        expect(removeTaskMock).toHaveBeenCalled();
    });
    test("Adding task", () => {
        const inputTodo = <HTMLInputElement>document.getElementById("todo");
        const newTask = "cooking";

        expect(todo.state.tasks.indexOf(newTask)).toBe(-1);

        inputTodo.value = newTask;
        todo.addTask();
        expect(todo.state.tasks.length).toBe(2);
        expect(todo.state.tasks.indexOf(newTask)).not.toBe(-1);
        // adding the same task doesn't affect
        inputTodo.value = newTask;
        todo.addTask();
        expect(todo.state.tasks.length).toBe(2);
    });
    test("Task removal", () => {
        const target = todo.elem.querySelector("button.remove");
        const event = {target} as unknown as Event;
        todo.removeTask(event);
        expect(todo.state.tasks.length).toBe(0);
    });
});