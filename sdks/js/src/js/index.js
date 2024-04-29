import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { register, unregister, CopilotProvider, TextAssistant } from "../index";

(function (win) {
  win.sai = win.sai || {
    register: register,
    unregister: unregister,
    actions: [],
    actionCallbacks: [],
    config: function (config) {
      this.config = config;
    },
    preDefinedAssistants: [VoiceAssistant, TextAssistant],
    assistants: [],
    addAssistant: function (elementId, assistant, args) {
      this.assistants.push({
        elementId: elementId,
        assistantType: assistant,
        options: args,
      });
    },
    removeAssistant: function (assistantId) {
      const index = this.assistants.findIndex(
        (assistant) => assistant.options.id === assistantId,
      );
      if (index !== -1) {
        this.assistants.splice(index, 1);
      }
    },
    App: function App(assistant) {
      const { assistantType, options } = assistant;
      const assistantComponent = this.preDefinedAssistants.find(
        (assistant) => assistant.name === assistantType,
      );

      if (assistantComponent) {
        return createElement(
          CopilotProvider,
          {
            config: this.config,
          },
          createElement(assistantComponent, {
            actionsFn: () => this.actions,
            actionCallbacksFn: () => this.actionCallbacks,
            ...options,
          }),
        );
      } else {
        console.error(
          `Assistant '${assistantType}' not found in preDefinedAssistants`,
        );
        return null;
      }
    },
    render: function render() {
      this.assistants.forEach((assistant) => {
        const el = document.getElementById(assistant.elementId);
        if (!el) {
          console.error(`Element with id '${assistant.elementId}' not found.`);
          return;
        }

        el.addEventListener("click", function (e) {
          e.preventDefault();
        });

        const root = createRoot(el);
        root.render(this.App(assistant));
      });
    },
    init: function init() {
      if (typeof win.saiData !== "undefined") {
        win.saiData = win.saiData || [];
        win.saiData.forEach(this.processArgument);
        win.saiData.push = this.processArgument;
      }
      this.render();
    },
    processArgument: function processArgument(args) {
      const [fn, ...argsValue] = args;
      if (fn === "register" || fn === "unregister") {
        win.sai[fn](...argsValue, win.sai.actions, win.sai.actionCallbacks);
      } else {
        win.sai[fn](...argsValue);
      }
    },
  };

  win.sai.init();
})(window);
