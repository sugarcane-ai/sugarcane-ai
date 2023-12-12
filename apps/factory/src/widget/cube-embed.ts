(function () {
  window.addEventListener("DOMContentLoaded", () => {
    let scriptLoaded: HTMLElement | null =
      document.getElementById("script-loaded");
    if (!scriptLoaded) {
      scriptLoaded = document.createElement("div");
      scriptLoaded.id = "script-loaded";
      document.body.appendChild(scriptLoaded);

      const sugarCubeAnchors = getAllSugarCubeAnchors();
      addButtonEventListener(sugarCubeAnchors);
    }
  });
})();

function getAllSugarCubeAnchors(): NodeListOf<Element> {
  const sugarCubeAnchorList = document.querySelectorAll("a[data-cube]");
  return sugarCubeAnchorList;
}

function addButtonEventListener(anchors: NodeListOf<Element>) {
  anchors.forEach((button) => {
    button.addEventListener("click", (event: Event) => {
      event.preventDefault();
      const url = button.getAttribute("href");
      if (url !== null) {
        openPopupWindow(url);
      }
    });
  });
}

function openPopupWindow(url: string) {
  if (url && isValidSugarCubeUrl(url)) {
    let popupWindow;
    try {
      popupWindow = window.open(
        url,
        "sugar-cube-popup",
        "width=720,height=480",
      );
    } catch (e) {
      console.error("Failed to open popup window");
    }
    if (popupWindow && !popupWindow?.closed) {
      popupWindow.location.href = url;
    }
  }
}

function isValidSugarCubeUrl(url: string): boolean {
  const regex =
    /^https:\/\/play\.sugarcaneai\.dev\/[^/]{1,}\/[^/]{1,}\/[^/]{1,}\/[^/]{1,}\/?/;
  return regex.test(url);
}
