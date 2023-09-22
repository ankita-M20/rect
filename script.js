document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".container");
  const createRectangleButton = document.querySelector("#create-rectangle");
  let isDragging = false;
  let startX, startY, startLeft, startTop;
  let isResizing = false;
  let pointerId1;
  let initialWidth, initialHeight;

  createRectangleButton.addEventListener("click", () => {
    const rectangle = document.createElement("div");
    rectangle.classList.add("rectangle");
    container.appendChild(rectangle);

    // Initial position and size
    rectangle.style.left = "50px";
    rectangle.style.top = "50px";
    rectangle.style.width = "100px"; // Set a minimum width
    rectangle.style.height = "100px"; // Set a minimum height

    rectangle.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "touch" || e.pointerType === "mouse") {
        if (e.isPrimary) {
          // Single-touch or mouse for dragging
          isDragging = true;
          pointerId1 = e.pointerId;
          startX = e.clientX;
          startY = e.clientY;
          startLeft = rectangle.offsetLeft;
          startTop = rectangle.offsetTop;
          rectangle.setPointerCapture(pointerId1);
          rectangle.style.transition = "none";
        } else {
          // Two-finger touch for resizing
          isResizing = true;
          pointerId1 = e.pointerId;
          const rect = rectangle.getBoundingClientRect();
          initialWidth = rect.width;
          initialHeight = rect.height;
        }
      }
    });

    container.addEventListener("pointermove", (e) => {
      if (e.pointerId === pointerId1) {
        if (isDragging) {
          const offsetX = e.clientX - startX;
          const offsetY = e.clientY - startY;
          const newLeft = startLeft + offsetX;
          const newTop = startTop + offsetY;

          // Ensure the rectangle stays within the container boundaries
          if (
            newLeft >= 0 &&
            newLeft + rectangle.offsetWidth <= container.offsetWidth
          ) {
            rectangle.style.left = newLeft + "px";
          }

          if (
            newTop >= 0 &&
            newTop + rectangle.offsetHeight <= container.offsetHeight
          ) {
            rectangle.style.top = newTop + "px";
          }
        } else if (isResizing) {
          // Resize the rectangle using two-finger touch
          const rect = rectangle.getBoundingClientRect();
          const deltaX1 = e.clientX - rect.left;
          const deltaY1 = e.clientY - rect.top;
          const deltaX2 = rect.left + rect.width - e.clientX;
          const deltaY2 = rect.top + rect.height - e.clientY;

          const newWidth = initialWidth + deltaX1 + deltaX2;
          const newHeight = initialHeight + deltaY1 + deltaY2;

          // Ensure the rectangle has a minimum size of 100px
          if (newWidth >= 100 && newHeight >= 100) {
            rectangle.style.width = newWidth + "px";
            rectangle.style.height = newHeight + "px";
          }
        }
      }
    });

    container.addEventListener("pointerup", (e) => {
      if (e.pointerId === pointerId1) {
        isDragging = false;
        isResizing = false;
        pointerId1 = undefined;
        rectangle.style.transition = "all 0.3s ease"; // Add back transition for smoothness
      }
    });

    container.addEventListener("pointercancel", (e) => {
      if (e.pointerId === pointerId1) {
        isDragging = false;
        isResizing = false;
        pointerId1 = undefined;
        rectangle.style.transition = "all 0.3s ease"; // Add back transition for smoothness
      }
    });

    rectangle.addEventListener("wheel", (e) => {
      // Resize the rectangle using mouse scroll
      const delta = e.deltaY;
      const currentWidth = rectangle.offsetWidth;
      const currentHeight = rectangle.offsetHeight;

      if (delta > 0) {
        // Scrolling down, decrease size
        rectangle.style.width = Math.max(currentWidth * 0.9, 100) + "px";
        rectangle.style.height = Math.max(currentHeight * 0.9, 100) + "px";
      } else {
        // Scrolling up, increase size
        rectangle.style.width = currentWidth * 1.1 + "px";
        rectangle.style.height = currentHeight * 1.1 + "px";
      }
      e.preventDefault(); // Prevent the page from scrolling
    });
  });
});
