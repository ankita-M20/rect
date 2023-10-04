//drawing shapes
class Shape {
  constructor(canvas, ctx, color, isFilled) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.color = color;
    this.isFilled = isFilled;
    this.points = [];
  }
}

class Rectangle extends Shape {
  constructor(canvas, ctx, color, isFilled, drawingApp) {
    super(canvas, ctx, color);
    this.isDrawing = false;
    this.points = []; // Array to store the four corners of the rectangle
    this.isFilled = isFilled;
    this.drawingApp = drawingApp;
    // New instance variables to track the starting point of the next rectangle
    this.nextStartX = 0;
    this.nextStartY = 0;
  }

  // Add a method to update the starting point
  updateStartPoint(x, y) {
    this.nextStartX = x;
    this.nextStartY = y;
  }

  startDrawing(x, y) {
    this.isDrawing = true;
    this.points = [x, y, x, y]; // Initialize with the top-left corner
  }

  continueDrawing(x, y) {
    if (!this.isDrawing) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.drawingApp.redrawRectangles();
    console.log("ContinueDrawing function");

    // Use the updated starting point for the current rectangle
    const startX = this.nextStartX;
    const startY = this.nextStartY;

    // Update the second point (top-right corner)
    this.points[2] = x;
    this.points[1] = y;

    if (
      this.points[0] !== undefined &&
      this.points[1] !== undefined &&
      this.points[2] !== undefined &&
      this.points[3] !== undefined
    ) {
      // Calculate the other two corners based on the first two
      const [x1, y1, x2, y2] = this.points;
      const width = Math.abs(x2 - x1);
      const height = Math.abs(y2 - y1);

      /*quad
        const x3 = x2;
        const y3 = y2 + height;
        const x4 = x1;
        const y4 = y1 + height;
    */
      this.ctx.fillStyle = this.color;
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = 2; // Change 2 to your desired line width

      this.ctx.beginPath();
      //  this.ctx.rect(this.startX, this.startY, width, height);
      /* quad
       this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.lineTo(x4, y4);
        this.ctx.closePath();*/

      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x1 + width, y1);
      this.ctx.lineTo(x1 + width, y1 + height);
      this.ctx.lineTo(x1, y1 + height);
      this.ctx.closePath();

      if (!this.isFilled) {
        this.ctx.stroke();
        //   console.log("new");
      } else {
        this.ctx.fill();
      }
      this.ctx.closePath();
    }
  }
  stopDrawing() {
    this.isDrawing = false;
  }

  draw() {
    if (this.points.length < 4) return; // You need at least 4 points to draw a rectangle

    const [x1, y1, x2, y2] = this.points;
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);

    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2; // Change 2 to your desired line width
    this.ctx.beginPath();
    this.ctx.rect(x1, y1, width, height);

    if (!this.isFilled) {
      this.ctx.stroke();
    } else {
      this.ctx.fill();
    }
    this.ctx.closePath();
  }
}

class Circle extends Shape {
  constructor(canvas, ctx, color, isFilled, drawingApp) {
    super(canvas, ctx, color);
    this.isDrawing = false;
    this.points = []; // Array to store the center and radius of the circle
    this.isFilled = isFilled;
    this.drawingApp = drawingApp;
  }

  startDrawing(x, y) {
    this.isDrawing = true;
    // Set the initial center point
    this.points = [x, y, 0];
  }

  continueDrawing(x, y) {
    if (!this.isDrawing) return;

    const radius = Math.sqrt(
      (x - this.points[0]) ** 2 + (y - this.points[1]) ** 2
    );

    this.points = [this.points[0], this.points[1], radius];

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawingApp.redrawRectangles();

    // Draw the current circle
    if (
      this.points[0] !== undefined &&
      this.points[1] !== undefined &&
      this.points[2] !== undefined
    ) {
      const [centerX, centerY, r] = this.points;
      this.ctx.fillStyle = this.color;
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = 2; // Change 2 to your desired line width

      this.ctx.beginPath();
      this.ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      if (this.isFilled) {
        this.ctx.fill();
      } else {
        this.ctx.stroke();
      }
      this.ctx.closePath();
    }
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  draw() {
    if (this.points.length < 3) return;

    const [centerX, centerY, r] = this.points;
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2; // Change 2 to your desired line width

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, r, 0, Math.PI * 2);

    if (this.isFilled) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
    this.ctx.closePath();
  }
}

class Triangle extends Shape {
  constructor(canvas, ctx, color, isFilled, drawingApp) {
    super(canvas, ctx, color);
    this.isDrawing = false;
    this.points = []; // Array to store the vertices of the triangle
    this.isFilled = isFilled;
    this.drawingApp = drawingApp;
  }

  startDrawing(x, y) {
    this.isDrawing = true;
    // Initialize the first vertex of the triangle
    this.points = [x, y, x, y, x, y]; // Three vertices (x, y, x, y, x, y)
  }

  continueDrawing(x, y) {
    if (!this.isDrawing) return;

    // Update the second vertex and calculate the third vertex based on mouse movement
    this.points[2] = x;
    this.points[3] = y;

    const [x1, y1, x2, y2] = this.points;

    // Calculate the length of each side of the equilateral triangle
    const sideLength = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    // Calculate the position of the third vertex
    const angle = Math.PI / 3; // 60 degrees in radians
    const x3 = x1 + sideLength * Math.cos(angle);
    const y3 = y1 + sideLength * Math.sin(angle);

    this.points[4] = x3;
    this.points[5] = y3;

    // Clear the canvas and redraw previous shapes
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawingApp.redrawRectangles();

    // Draw the current equilateral triangle
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2; // Change 2 to your desired line width

    this.ctx.beginPath();
    const [x1_, y1_, x2_, y2_, x3_, y3_] = this.points;
    this.ctx.moveTo(x1_, y1_);
    this.ctx.lineTo(x2_, y2_);
    this.ctx.lineTo(x3_, y3_);
    this.ctx.closePath();

    /* random triangle
    // Calculate the position of the third vertex based on the current mouse position
    const [x1, y1, x2, y2] = this.points;
    const x3 = x1 + (x2 - x1) * 2; // Example: Extend the triangle base by doubling its length
    const y3 = y2; // Keep the y-coordinate the same

    this.points[4] = x3;
    this.points[5] = y3;

  
    // Clear the canvas and redraw previous shapes
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawingApp.redrawRectangles();

    // Draw the current triangle
    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.beginPath();
    const [x1_, y1_, x2_, y2_, x3_, y3_] = this.points;
    this.ctx.moveTo(x1_, y1_);
    this.ctx.lineTo(x2_, y2_);
    this.ctx.lineTo(x3_, y3_);
    this.ctx.closePath();*/

    if (this.isFilled) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  draw() {
    if (this.points.length < 6) return; // You need at least 3 vertices to draw a triangle

    this.ctx.fillStyle = this.color;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = 2; // Change 2 to your desired line width

    this.ctx.beginPath();
    const [x1, y1, x2, y2, x3, y3] = this.points;
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.lineTo(x3, y3);
    this.ctx.closePath();

    if (this.isFilled) {
      this.ctx.fill();
    } else {
      this.ctx.stroke();
    }
  }
}

class Pen extends Shape {
  constructor(canvas, ctx, color, lineWidth, DrawingApp) {
    super(canvas, ctx, color, false); // Pen is not filled
    this.lineWidth = lineWidth;
    this.points = [];
    this.DrawingApp = DrawingApp;
    // this.strokes = []; // Array to store completed strokes
    // this.currentStroke = []; // Temporary storage for the current stroke
  }

  startDrawing(x, y) {
    this.isDrawing = true;
    this.points = [{ x, y }];
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
  }

  continueDrawing(x, y) {
    if (!this.isDrawing) return;
    this.points.push({ x, y });
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
  }

  stopDrawing() {
    if (!this.isDrawing) return;
    this.isDrawing = false;
    // Push the current pen stroke into the rectangles array
    this.DrawingApp.rectangles.push({
      type: "pen", // You can set the type to "pen" to distinguish it from other shapes
      color: this.color,
      lineWidth: this.lineWidth,
      points: this.points,
    });
    this.points = []; // Clear the points for the next stroke
  }
  draw() {
    // Pens are drawn as a sequence of lines connecting points
    if (this.points.length < 2) return;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.lineJoin = "round";
    this.ctx.lineCap = "round";
    this.ctx.beginPath();
    this.ctx.moveTo(this.points[0].x, this.points[0].y);
    for (let i = 1; i < this.points.length; i++) {
      this.ctx.lineTo(this.points[i].x, this.points[i].y);
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }
}

class DrawingApp {
  isDrawing = false;
  prevX = 0;
  prevY = 0;
  currentShape = null;

  constructor(activetool) {
    this.selectedTool = activetool;
    this.shapes = [];
    this.rectangles = []; // Array to store drawn rectangles
  }

  setActiveShape(shapeType) {
    this.selectedTool = shapeType;
  }

  startDrawing(event, ctx) {
    this.isDrawing = true;
    const { offsetX, offsetY } = event;
    console.log("startdrawing function");

    if (
      this.currentShape &&
      this.currentShape.constructor.name === "Rectangle"
    ) {
      // If the current shape is a rectangle and already exists, stop drawing it
      this.currentShape.stopDrawing();
      this.rectangles.push(this.currentShape); // Add the completed rectangle to the array
      this.redrawRectangles(); // so only one rect isnt modified everytime
      //console.log("if conditin ");
    } else if (
      this.currentShape &&
      this.currentShape.constructor.name === "Circle"
    ) {
      // If the current shape is a circle and already exists, stop drawing it
      this.currentShape.stopDrawing();
      this.rectangles.push(this.currentShape); // Add the completed circle to the array
      this.redrawRectangles();
    } else if (
      this.currentShape &&
      this.currentShape.constructor.name === "Triangle"
    ) {
      // If the current shape is a triangle and already exists, stop drawing it
      this.currentShape.stopDrawing();
      this.rectangles.push(this.currentShape); // Add the completed triangle to the array
      this.redrawRectangles();
    } else if (
      this.currentShape &&
      this.currentShape.constructor.name === "Pen"
    ) {
      this.currentShape.stopDrawing();
      this.rectangles.push(this.currentShape);
      this.redrawRectangles();
    }

    switch (this.selectedTool) {
      case "triangle":
        this.currentShape = new Triangle(
          ctx.canvas,
          ctx,
          globalcolor,
          isFilledGlobally,
          this
        );
        this.currentShape.startDrawing(offsetX, offsetY);
        break;

        break;
      case "rectangle":
        this.currentShape = new Rectangle(
          ctx.canvas,
          ctx,
          globalcolor,
          isFilledGlobally,
          this
        );
        this.currentShape.startDrawing(offsetX, offsetY);
        break;
      case "circle":
        this.currentShape = new Circle(
          ctx.canvas,
          ctx,
          globalcolor,
          isFilledGlobally,
          this
        );
        this.currentShape.startDrawing(offsetX, offsetY);
        break;
      case "pen":
        this.currentShape = new Pen(ctx.canvas, ctx, "green", 2, this);
        this.currentShape.startDrawing(offsetX, offsetY);
        break;
      case "brush":
        this.isDrawing = false;
      default:
        break;
    }

    this.prevX = offsetX;
    this.prevY = offsetY;

    console.log(this.prevX, this.prevY);
    //  this.stopDrawing();
  }

  continueDrawing(event) {
    if (!this.isDrawing) return;
    this.redrawRectangles();
    console.log("DrawApp continue drawing");
    const { offsetX, offsetY } = event;
    this.currentShape.continueDrawing(offsetX, offsetY);

    /* Check the current shape type and call the corresponding method
    if (this.currentShape instanceof Rectangle) {
      this.currentShape.continueDrawing(offsetX, offsetY);
    } else if (this.currentShape instanceof Circle) {
      this.currentShape.continueDrawing(offsetX, offsetY);
    }if (this.currentShape instanceof Triangle) {
  this.currentShape.continueDrawing(offsetX, offsetY);
} */
  }

  stopDrawing(event) {
    this.isDrawing = false;
    if (this.currentShape) {
      this.rectangles.push(this.currentShape); // Add the completed shape to the array
      this.currentShape = "brush"; // Reset the current shape
    }
    //this.currentShape.stopDrawing();
  }

  redrawRectangles() {
    // Clear the canvas
    //this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // Draw all rectangles from the array
    for (const rect of this.rectangles) {
      rect.draw();
    }
  }
}

//--------------------------------------------------------------------------------------------

class DrawingCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext("2d");
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.DrawingApp = new DrawingApp();
    this.DrawingApp = new DrawingApp(this.stopDrawing);

    // Change "rectangle" to your desired default tool
    //   this.DrawingApp.setActiveShape("rectangle"); // Set the active tool

    this.mouse = {
      x: null,
      y: null,
    };

    this.DrawingApp = new DrawingApp(this.activeShape);
    //this.isDrawingCircle = false;
    //this.isDrawingRect = false;
    //this.isBrush = false;
    //this.isEraser = false;

    //this.circles = [[]];
    this.rectangles = [[]];

    //this.currentStroke = []; // Initialize an empty stroke
    this.strokes = [[]];
    // this.undoStack = [];
    //this.redoStack = [];

    this.DrawingShapeRectangle = false; // this is shapes in general

    this.isDrawingEnabled = false;
    this.activeButton = null;

    this.pens = [];
    this.currentPen = null;
    this.isDrawingPen = false; // Flag to determine if the current tool is the pen

    this.canvas.addEventListener("click", (event) => {
      if (this.isDrawingEnabled) {
        if (this.DrawingApp.selectedTool === "brush") {
          //  this.DrawingApp.stopDrawing();
          handleDrawingClick();
        } else if (
          this.DrawingApp.selectedTool === "rectangle" ||
          this.DrawingApp.selectedTool === "triangle" ||
          this.DrawingApp.selectedTool === "circle"
        ) {
          this.DrawingApp.startDrawing(event, this.ctx);
        }
      }
      this.toggleDrawing();
    });

    this.canvas.addEventListener("pointermove", (event) => {
      /*if (this.isDrawingEnabled) {
        if (this.DrawingApp.selectedTool === "brush") {
          this.handlePointerMove(event);
        } else if (
          this.DrawingApp.selectedTool === "rectangle" ||
          this.DrawingApp.selectedTool === "triangle" ||
          this.DrawingApp.selectedTool === "circle"
        ) {
          this.DrawingApp.continueDrawing(event);
        }
      }*/
      if (this.isDrawingEnabled) {
        if (this.isDrawingPen) {
          // If drawing with the pen, continue drawing with it
          const x = event.clientX - this.canvas.getBoundingClientRect().left;
          const y = event.clientY - this.canvas.getBoundingClientRect().top;
          this.currentPen.continueDrawing(x, y);
        } else {
          // If drawing with another tool, continue drawing with that tool
          this.DrawingApp.continueDrawing(event);
        }
      }
    });

    this.canvas.addEventListener("pointerdown", (event) => {
      if (this.isDrawingEnabled) {
        if (this.currentPen) {
          // If a pen is selected, start drawing with it
          this.isDrawingPen = true;
          const x = event.clientX - this.canvas.getBoundingClientRect().left;
          const y = event.clientY - this.canvas.getBoundingClientRect().top;
          this.currentPen.startDrawing(x, y);
        } else {
          // If another shape tool is selected, start drawing with that tool
          this.isDrawingPen = false;
          this.DrawingApp.startDrawing(event, this.ctx);
        }
      }
    });

    this.canvas.addEventListener("pointerup", (event) => {
      if (this.isDrawingEnabled) {
        // If a pen is selected, stop drawing with it
        if (this.isDrawingPen) {
          this.currentPen.stopDrawing();
          this.pens.push(this.currentPen);
          this.currentPen = null;
        } else {
          this.DrawingApp.stopDrawing();
        }
      }
    });

    window.addEventListener("resize", () => {
      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;
    });
  }

  redraw() {
    this.clearCanvas();
    for (const rect of this.rectangles) {
      rect.draw();
    }
  }

  setActiveShape(shapeType) {
    this.activeShape = shapeType;
    this.DrawingApp.setActiveShape(this.activeShape);

    // Stop any ongoing pen drawing
    if (this.isDrawingPen) {
      this.isDrawingPen = false;
      this.currentPen.stopDrawing();
      this.rectangles.push(this.currentPen);
      this.currentPen = null;
    }

    // Toggle the drawing mode based on the selected shape or pen tool
    if (this.activeShape === "pen") {
      this.toggleDrawing();
    } else {
      this.toggleDrawing(true); // Disable drawing when selecting shapes
    }

    this.redraw(); // Redraw rectangles after changing tools

    //this.DrawingApp.stopDrawing();
    console.log(this.activeShape);
    console.log(this.DrawingApp);
  }

  setActivePen(penType, color, lineWidth) {
    // Create a new pen and set it as the current pen
    this.currentPen = new Pen(this.canvas, this.ctx, color, lineWidth);
  }

  //Strokes cases
  handleDrawingClick() {
    this.DrawingApp.stopDrawing();
    const currentStroke = {
      type: this.activeButton.id,
      data: this.isBrush ? [] : this.circles.slice(),
    };

    this.strokes.push(currentStroke);
    this.redoStack = [];
  }

  toggleDrawing() {
    this.isDrawingEnabled = !this.isDrawingEnabled;

    if (!this.isDrawingEnabled) {
      this.canvas.removeEventListener("pointermove", this.handlePointerMove);
      if (this.isDrawingRect) {
        this.rectangles = [];
      } else if (this.isDrawingCircle || this.isBrush || this.isEraser) {
        this.circles = [];
      }
    } else {
      this.canvas.addEventListener("pointermove", this.handlePointerMove);
    }
  }

  handlePointerMove = (event) => {
    this.mouse.x = event.clientX;
    this.mouse.y = event.clientY;

    if (
      this.isDrawingCircle &&
      !this.isDrawingRect &&
      !this.isBrush &&
      !this.isEraser
    ) {
      DrawingUtility.drawCircle(this.ctx, this.circles, this.mouse, "red", 2);
    }

    if (this.isBrush) {
      DrawingUtility.drawCircle(
        this.ctx,
        this.circles,
        this.mouse,
        "rgba(130, 255, 132, 0.2)",
        50
      );
    } else if (
      !this.isDrawingCircle &&
      !this.isDrawingRect &&
      !this.isBrush &&
      this.isEraser
    ) {
      DrawingUtility.drawCircle(
        this.ctx,
        this.circles,
        this.mouse,
        "cornsilk",
        60
      );
    } else if (
      !this.isDrawingCircle &&
      this.isDrawingRect &&
      !this.isBrush &&
      !this.isEraser
    ) {
      DrawingUtility.drawRect(
        this.ctx,
        this.rectangles,
        this.mouse,
        this.isDrawingRect
      );
    }

    if (this.isDrawingEnabled && this.currentShape) {
      this.currentShape.continueDrawing(this.mouse.x, this.mouse.y);
    }
  };

  //similar to clear canvas

  undo() {
    if (this.strokes.length > 0) {
      const lastStroke = this.strokes.pop();

      this.redoStack.push(lastStroke);
      // this.clearCanvas();

      for (const stroke of this.strokes) {
        if (stroke.type === "circle") {
          for (const circle of stroke.data) {
            this.drawCircle("red", 2, circle.x, circle.y);
          }
        } else if (stroke.type === "rectangle") {
          // Redraw rectangles if needed
        } else if (stroke.type === "brush") {
          // Redraw brush strokes if needed
        }
      }
    }
  }
  //not working yet
  redo() {
    if (this.redoStack.length > 0) {
      const nextStroke = this.redoStack.pop();

      this.strokes.push(nextStroke);
      // this.clearCanvas();

      for (const stroke of this.strokes) {
        if (stroke.type === "circle") {
          for (const circle of stroke.data) {
            this.drawCircle("red", 2, circle.x, circle.y);
          }
        } else if (stroke.type === "rectangle") {
          // Redraw rectangles if needed
        } else if (stroke.type === "brush") {
          // Redraw brush strokes if needed
        }
      }
    }
  }
  //doesn't work
  redrawStrokes() {
    for (const rectangle of this.rectangles) {
      this.ctx.fillStyle = rectangle.color;
      this.ctx.strokeStyle = rectangle.color;
      this.ctx.beginPath();
      this.ctx.rect(
        rectangle.x,
        rectangle.y,
        rectangle.width,
        rectangle.height
      );
      if (!rectangle.isFilled) {
        this.ctx.stroke();
      } else {
        this.ctx.fill();
      }
      this.ctx.closePath();
    }
  }

  startDrawing(targetButton) {
    const toggleDrawingButton = document.getElementById("toggle-drawing");
    const brushHighlighter = document.getElementById("brush-highlighter");
    const paintBrushButton = document.getElementById("paintbrush");
    const eraseButton = document.getElementById("erase-button");

    if (targetButton === toggleDrawingButton) {
      this.isDrawingCircle = !this.isDrawingCircle;
      toggleDrawingButton.classList.toggle("selected-brush");

      this.DrawingApp.stopDrawing();
      this.isDrawingRect = false;
      this.isBrush = false;
      this.isEraser = false;
      brushHighlighter.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } else if (targetButton === brushHighlighter) {
      this.isDrawingRect = !this.isDrawingRect;
      brushHighlighter.classList.toggle("selected-brush");
      this.DrawingApp.stopDrawing();

      this.isDrawingCircle = false;
      this.isBrush = false;
      this.isEraser = false;
      toggleDrawingButton.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } else if (targetButton === paintBrushButton) {
      this.isBrush = !this.isBrush;
      paintBrushButton.classList.toggle("selected-brush");
      this.DrawingApp.stopDrawing();

      this.isDrawingCircle = false;
      this.isDrawingRect = false;
      this.isEraser = false;
      toggleDrawingButton.classList.remove("selected-brush");
      brushHighlighter.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    } else if (targetButton === eraseButton) {
      this.isEraser = !this.isEraser;
      eraseButton.classList.toggle("selected-brush");
      this.DrawingApp.stopDrawing();

      this.isDrawingCircle = false;
      this.isDrawingRect = false;
      this.isBrush = false;
      toggleDrawingButton.classList.remove("selected-brush");
      brushHighlighter.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
    } else {
      this.isBrush = false;
      this.isDrawingCircle = false;
      this.isDrawingRect = false;
      this.eraseButton = false;

      toggleDrawingButton.classList.remove("selected-brush");
      brushHighlighter.classList.remove("selected-brush");
      paintBrushButton.classList.remove("selected-brush");
      eraseButton.classList.remove("selected-brush");
    }

    this.activeButton = targetButton;
  }
}

/*****************class ends *****************/
// Create an instance of the DrawingCanvas class and specify the canvas ID
const canvas1 = new DrawingCanvas("canvas1");
canvas1.startDrawing();

const toggleDrawingButton = document.getElementById("toggle-drawing");
toggleDrawingButton.addEventListener("click", () => {
  //canvas1.startDrawing(toggleDrawingButton);
  toggleDrawingButton.classList.toggle("selected-brush");
  brushHighlighter.classList.remove("selected-brush");
  eraseButton.classList.remove("selected-brush");

  canvas1.setActivePen("pen", "blue", 2); // Blue pen with line width 2
});

// Add event listener to toggle between drawing circles and rectangles
const brushHighlighter = document.getElementById("brush-highlighter");
brushHighlighter.addEventListener("click", () => {
  brushHighlighter.classList.toggle("selected-brush");
  toggleDrawingButton.classList.remove("selected-brush");
  eraseButton.classList.remove("selected-brush");
  canvas1.setActivePen("pen", "yellow", 20); // Blue pen with line width 2
  //canvas1.startDrawing(brushHighlighter);
});

const eraseButton = document.getElementById("erase-button");
eraseButton.addEventListener("click", () => {
  // console.log("event listner erase");
  // canvas1.startDrawing(eraseButton);
  eraseButton.classList.toggle("selected-brush");
  toggleDrawingButton.classList.remove("selected-brush");
  brushHighlighter.classList.remove("selected-brush");
  canvas1.setActivePen("pen", "cornsilk", 50); // Blue pen with line width 2
});

const paintBrushButton = document.getElementById("paintbrush");
paintBrushButton.addEventListener("click", () => {
  // console.log("event listner paint");
  canvas1.startDrawing(paintBrushButton);
});

const undoButton = document.getElementById("undo-btn");
undoButton.addEventListener("click", () => {
  console.log("undo");
  canvas1.undo();
});

const redoButton = document.getElementById("redo-btn");
redoButton.addEventListener("click", () => {
  console.log("redo");
  canvas1.redo();
});

document.addEventListener("DOMContentLoaded", function () {
  const dropdownIcon = document.querySelector(".dropdown-icon");
  const whiteBox = document.querySelector(".white-box");
  const whiteBoxOptions = whiteBox.querySelectorAll(".options");

  dropdownIcon.addEventListener("click", () => {
    whiteBox.classList.toggle("hidden");
    // Disable drawing modes
    canvas1.startDrawing();

    // Call the toggleDrawing method to update the drawing state
    canvas1.toggleDrawing();
  });

  // Add event listeners to options inside the white box
  whiteBoxOptions.forEach(function (option) {
    option.addEventListener("click", function () {
      whiteBox.classList.add("hidden");
    });
  });

  // Add event listeners to shape options inside the white box
  const shapeOptions = whiteBox.querySelectorAll(".sec-options .icons div");
  shapeOptions.forEach(function (shapeOption) {
    shapeOption.addEventListener("click", function () {
      whiteBox.classList.add("hidden");
    });
  });
});

//shapes

// Add event listeners to shape elements
const radioShape = document.getElementById("radio");
const rectangleShape = document.getElementById("rectangle");
const triangleShape = document.getElementById("triangle");
const circleShape = document.getElementById("circle");
const ovalShape = document.getElementById("oval");

radioShape.addEventListener("click", () => {
  if (canvas1.currentPen) {
    canvas1.currentPen.stopDrawing();
    canvas1.currentPen = null;
  }
  canvas1.setActiveShape("radio"); // Set the active shape type
});

rectangleShape.addEventListener("click", () => {
  if (canvas1.currentPen) {
    canvas1.currentPen.stopDrawing();
    canvas1.currentPen = null;
  }

  canvas1.setActiveShape("rectangle");
});

triangleShape.addEventListener("click", () => {
  if (canvas1.currentPen) {
    canvas1.currentPen.stopDrawing();
    canvas1.currentPen = null;
  }

  canvas1.setActiveShape("triangle");
});

circleShape.addEventListener("click", () => {
  if (canvas1.currentPen) {
    canvas1.currentPen.stopDrawing();
    canvas1.currentPen = null;
  }

  canvas1.setActiveShape("circle");
});

//const canvas1 = new DrawingCanvas("canvas1");
// Define a global variable to track the fill state
let isFilledGlobally = false;

// Function to update the global isFilled variable
function updateIsFilled() {
  const fillCheckbox = document.getElementById("fill");
  isFilledGlobally = fillCheckbox.checked;
}

// Add an event listener to the checkbox
document.getElementById("fill").addEventListener("change", updateIsFilled);

// Define a global variable to track the selected color
let globalcolor = "black"; // Default color

// Function to update the global color variable
function updateColor(event) {
  const selectedColor = event.target.id;
  if (
    selectedColor === "yellow" ||
    selectedColor === "red" ||
    selectedColor === "green"
  ) {
    globalcolor = selectedColor;
  }
}

// Add event listeners to the color div elements
const colorDivs = document.querySelectorAll(".pen-color");
colorDivs.forEach((div) => {
  div.addEventListener("click", updateColor);
});
