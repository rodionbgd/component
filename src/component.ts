import TemplateManager from "./template_manager";

export default class Component<State = {}> extends TemplateManager {
    elem: HTMLElement;

    state: State | undefined;

    events: {
        // eslint-disable-next-line no-unused-vars
        [key: string]: (event: Event) => void;
    };

    private readonly template: string;

    constructor(
        element: HTMLElement,
        template: string,
        initialState: Partial<State>
    ) {
        super();
        this.state = initialState as State;
        this.elem = element;
        this.events = {};
        this.template = template;
    }

    subscribeToEvents() {
        Object.entries(this.events).forEach(([key, value]) => {
            const eventProps = key.split("@");
            const event = eventProps[0];
            const elem = eventProps[1].split(".")[0];
            const className = eventProps[1].split(".")[1];
            const selector = `${elem}${className ? `.${className}` : ""}`;
            const all = eventProps[1].split(".")[2]
            if (all && all.toLowerCase() === "all") {
                this.elem.querySelectorAll(selector).forEach(listener => listener.addEventListener(event, value));
            } else {
                const listener = <HTMLElement>this.elem.querySelector(selector);
                listener.addEventListener(event, value);
            }
        });
    }

    setState(patch: any) {
        Object.entries(patch).forEach(([key, value]) => {
            (this.state as any)[key] = value;
        });
        this.elem.innerHTML = this.render();
        this.subscribeToEvents();
    }

    onMount(el: HTMLElement) {
        console.group(el.id);
        Object.entries(this.state!).forEach(([key, value]) => {
            console.log(`${key}: ${value}`);
        });
        console.groupEnd();
    }

    render() {
        const {template} = this;
        return this.replaceVariablesValues(
            this.replaceLoops(template, this.state),
            this.state
        );
    }
};
