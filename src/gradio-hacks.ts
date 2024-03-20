// hacks to make gradio work clientside
(globalThis as any).window = globalThis;
(globalThis as any).location = {
	protocol: "",
};
import EventSource from "./eventsource";
(globalThis as any).EventSource = EventSource;