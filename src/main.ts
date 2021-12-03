import "./style.scss";
import Clicker from "./clicker";
import Todo from "./todo";
import TemplateManager from "./template_manager";

function init() {
  const app1 = <HTMLElement>document.getElementById("app1");
  const app2 = <HTMLElement>document.getElementById("app2");
  const template1 = `
       <h1>Count {{value}} {{input}}</h1>
        <input value="{{input}}">
        <button class="dec">-</button>
        <button class="inc">+</button>
    `;
  const template2 = `
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
  // eslint-disable-next-line no-unused-vars
  const clicker = new Clicker(app1, template1, TemplateManager, {
    value: 50,
    input: "Hello",
  });
  // eslint-disable-next-line no-unused-vars
  const todo = new Todo(app2, template2, TemplateManager, {
    tasks: ["shopping"],
    input: "shopping",
  });
}

window.addEventListener("load", init);
