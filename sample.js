class Rectangle {
  constructor(context, x, y, width, height) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.isSelected = false;
    this.isDragging = false;
  }

  draw() {
    // this.context.fillStyle = this.isSelected ? "blue" : "red";
    // this.context.fillRect(this.x, this.y, this.width, this.height);
    // Draw the rectangle's border
    this.context.strokeStyle = this.isSelected ? "blue" : "red";
    this.context.lineWidth = 2;
    this.context.strokeRect(this.x, this.y, this.width, this.height);

    // Draw an additional black border for the selected rectangle
    if (this.isSelected) {
      this.context.strokeStyle = "black";
      this.context.lineWidth = 4; // you can adjust the width as needed
      this.context.strokeRect(
        this.x - 2,
        this.y - 2,
        this.width + 4,
        this.height + 4
      );
    }
  }

  contains(x, y) {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  startDrag() {
    this.isDragging = true;
  }

  stopDrag() {
    this.isDragging = false;
  }

  drag(dx, dy) {
    this.x += dx;
    this.y += dy;
  }

  resize(scaleFactor) {
    this.width *= scaleFactor;
    this.height *= scaleFactor;
  }
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const rectangles = [];
let selectedRectangle = null;
let isDragging = false;

canvas.addEventListener("pointerdown", (e) => {
  const mouseX = e.clientX - canvas.getBoundingClientRect().left;
  const mouseY = e.clientY - canvas.getBoundingClientRect().top;

  // Check if the pointer is over any rectangle
  for (const rectangle of rectangles) {
    if (rectangle.contains(mouseX, mouseY)) {
      rectangle.startDrag();
      selectedRectangle = rectangle;
      isDragging = true;
      break;
    }
  }

  if (!isDragging) {
    selectedRectangle = null;
  }
});

canvas.addEventListener("pointermove", (e) => {
  if (isDragging && selectedRectangle) {
    const dx = e.movementX;
    const dy = e.movementY;
    selectedRectangle.drag(dx, dy);
    drawRectangles();
  }
});

canvas.addEventListener("pointerup", () => {
  if (selectedRectangle) {
    selectedRectangle.stopDrag();
    isDragging = false;
  }
});

canvas.addEventListener("wheel", (e) => {
  if (selectedRectangle) {
    const delta = e.deltaY;
    const scaleFactor = delta > 0 ? 0.9 : 1.1; // Adjust the scaling factor as needed
    selectedRectangle.resize(scaleFactor);
    drawRectangles();
    e.preventDefault();
  }
});

canvas.addEventListener("touchstart", (e) => {
  if (e.touches.length === 2) {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    pinchStartDistance = Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    );
    pinchStartWidth = selectedRectangle.width;
  }
});

canvas.addEventListener("touchmove", (e) => {
  if (e.touches.length === 2 && selectedRectangle) {
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const pinchCurrentDistance = Math.hypot(
      touch1.clientX - touch2.clientX,
      touch1.clientY - touch2.clientY
    );
    const scaleFactor = pinchCurrentDistance / pinchStartDistance;
    selectedRectangle.width = pinchStartWidth * scaleFactor;
    selectedRectangle.height = pinchStartWidth * scaleFactor; // Assuming square resizing
    drawRectangles();
    e.preventDefault();
  }
});

const createRectBtn = document.getElementById("createRectBtn");

createRectBtn.addEventListener("click", () => {
  const x = Math.random() * (canvas.width - 100); // Random x position
  const y = Math.random() * (canvas.height - 100); // Random y position
  const width = 100; // Initial width
  const height = 100; // Initial height

  const newRectangle = new Rectangle(ctx, x, y, width, height);
  rectangles.push(newRectangle);
  drawRectangles();
});

function drawRectangles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const rectangle of rectangles) {
    rectangle.draw();
  }
}

drawRectangles();
