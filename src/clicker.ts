import Component from "./component";

type State = {
  value: number;
  input: string;
};

export default class Clicker extends Component {
  state = {
    value: 1,
    input: "123",
  };

  constructor(element: HTMLElement, template: string, initialState: State) {
    super(element, template, initialState);
    this.setState(initialState);
    this.onMount(this.elem);
  }

  increaseCounter() {
    this.setState({ value: this.state.value + 1 });
  }

  decreaseCounter() {
    this.setState({ value: this.state.value - 1 });
  }

  setInputValue(event: Event) {
    this.setState({ input: (event.target as HTMLInputElement).value });
  }

  events = {
    "click@button.dec": this.decreaseCounter.bind(this),
    "click@button.inc": this.increaseCounter.bind(this),
    "change@input": this.setInputValue.bind(this),
  };
}
