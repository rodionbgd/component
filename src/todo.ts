import Component from "./component";
import {TMType} from "./template_manager";

type State = {
  tasks: string[];
  input: string;
};

export default class Todo extends Component {
  state = {
    tasks: ["shopping"],
    input: "",
  };

  constructor(
    element: HTMLElement,
    template: string,
    templateManager: TMType,
    initialState: State
  ) {
    super(element, template, templateManager, initialState);
    this.setState(initialState);
    this.onMount(this.elem);
  }

  addTask() {
    const inputElem = this.elem.getElementsByTagName("input")[0];
    if (
      !inputElem ||
      !inputElem.value ||
      this.state.tasks.indexOf(inputElem.value) !== -1
    ) {
      return;
    }
    this.setState({
      ...this.state,
      tasks: [...this.state.tasks, inputElem.value],
    });
    this.elem.getElementsByTagName("input")[0].value = "";
  }

  removeTask(event: Event) {
    const taskToRemove = (event.target as HTMLElement).parentElement!
      .firstElementChild;
    this.setState({
      ...this.state,
      tasks: this.state.tasks.filter(
        (task) => task !== taskToRemove!.innerHTML
      ),
    });
    this.elem.getElementsByTagName("input")[0].value = "";
  }

  events = {
    "click@button.add": this.addTask.bind(this),
    "click@button.remove.all": this.removeTask.bind(this),
  };
}
