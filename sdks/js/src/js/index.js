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
    assistants: [],
    addAssistant: function (assistant, args) {
      this.assistants.push({ type: assistant, options: args });
    },
    removeAssistant: function (assistantId) {
      const index = this.assistants.findIndex(
        (assistant) => assistant.options.id === assistantId,
      );
      if (index !== -1) {
        this.assistants.splice(index, 1);
      }
    },
    loadAssistant: function (assistantType) {
      switch (assistantType) {
        case "Voice":
          return VoiceAssistant;
        case "Text":
          return TextAssistant;
        default:
          return null;
      }
    },
    App: function App() {
      const assistantComponents = this.assistants.map(({ type, options }) =>
        createElement(this.loadAssistant(type), {
          key: type,
          actionsFn: () => win.sai.actions,
          actionCallbacksFn: () => win.sai.actionCallbacks,
          ...options,
        }),
      );
      return createElement(
        CopilotProvider,
        {
          config: win.sai.config,
        },
        assistantComponents,
      );
    },
    render: function render() {
      const el = document.getElementById("copilot-one");
      el.addEventListener("click", function (e) {
        e.preventDefault();
      });
      const root = createRoot(el);
      root.render(this.App());
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
      // const fn = args[0];
      // const argsValue = Array.prototype.slice.call(args, 1);
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
