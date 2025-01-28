import React, { ReactElement } from "react";
import { createRoot, Root } from "react-dom/client";

type ContainerProps = Record<string, any>; // Generic props for any slave component

class ContainersManager {
  private rootCache: Map<HTMLElement, Root>; // Cache for roots

  constructor() {
    this.rootCache = new Map();
  }

  /**
   * Renders a React component into a target element
   * @param selector CSS selector or unique ID of the target element
   * @param component React component to render
   * @param props Props for the component
   */
  renderComponent(
    selector: string,
    component: ReactElement,
    props: ContainerProps = {},
    position: InsertPosition = "afterend", // Default is "afterend"
    identifier: string = "sai-container-injected", // Default is "default"
  ): void {
    const targetElement = document.querySelector(selector) as HTMLElement;

    if (!targetElement) {
      console.warn(`Target element with selector "${selector}" not found.`);
      return;
    }

    // Check if a container with the identifier already exists
    const existingContainer = Array.from(
      targetElement.parentElement?.children || [],
    ).find((el) => el.getAttribute("data-identifier") === identifier);

    let containerElement: HTMLElement;

    if (existingContainer) {
      // Use the existing container
      containerElement = existingContainer as HTMLElement;
    } else {
      // Create a new container and insert it based on the position
      containerElement = document.createElement("div");
      containerElement.setAttribute("data-identifier", identifier);
      targetElement.insertAdjacentElement(position, containerElement);
    }

    let root: Root;

    // Check if a root already exists for the container
    if (this.rootCache.has(containerElement)) {
      root = this.rootCache.get(containerElement)!;
    } else {
      // Create a new root and store it in the cache
      root = createRoot(containerElement);
      this.rootCache.set(containerElement, root);
    }

    // Render the component with the provided props
    root.render(React.cloneElement(component, props));
  }

  /**
   * Unmounts a React component from the target element
   * @param selector CSS selector or unique ID of the target element
   */
  removeComponent(selector: string): void {
    const targetElement = document.querySelector(selector) as HTMLElement;

    if (targetElement && this.rootCache.has(targetElement)) {
      const root = this.rootCache.get(targetElement)!;
      root.unmount(); // Unmount the component
      this.rootCache.delete(targetElement); // Remove it from the cache
    }
  }

  /**
   * Cleans up all mounted components and clears the cache
   */
  cleanup(): void {
    this.rootCache.forEach((root) => root.unmount());
    this.rootCache.clear();
  }
}

export default ContainersManager;
