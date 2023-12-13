(function () {
  if (document.readyState !== "loading") {
    scriptInit();
  } else {
    window.addEventListener("DOMContentLoaded", scriptInit());
  }
})();

function scriptInit() {
  var scriptLoaded = document.getElementById("script-loaded");
  if (!scriptLoaded) {
    scriptLoaded = document.createElement("div");
    scriptLoaded.id = "script-loaded";
    document.body.appendChild(scriptLoaded);
    var sugarCubeAnchors = getAllSugarCubeAnchors();
    addButtonEventListener(sugarCubeAnchors);
  }
}

function getAllSugarCubeAnchors() {
  var sugarCubeAnchorList = document.querySelectorAll("a[data-cube]");
  console.log("sugarCubeAnchorList", sugarCubeAnchorList);
  return sugarCubeAnchorList;
}
function addButtonEventListener(anchors) {
  anchors.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      var url = button.getAttribute("href");
      if (url !== null) {
        openPopupWindow(url);
      }
    });
  });
}
function openPopupWindow(url) {
  if (url && isValidSugarCubeUrl(url)) {
    var popupWindow = void 0;
    try {
      popupWindow = window.open(
        url,
        "sugar-cube-popup",
        "width=720,height=480"
      );
    } catch (e) {
      console.error("Failed to open popup window");
    }
    if (
      popupWindow &&
      !(popupWindow === null || popupWindow === void 0
        ? void 0
        : popupWindow.closed)
    ) {
      popupWindow.location.href = url;
    }
  }
}
function isValidSugarCubeUrl(url) {
  var regex =
    /^https:\/\/play\.sugarcaneai\.dev\/[^/]{1,}\/[^/]{1,}\/[^/]{1,}\/[^/]{1,}\/?/;
  return regex.test(url);
}
