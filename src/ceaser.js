export function createCeaser(initialCurve, container, onChange) {
  const canvas = document.createElement("canvas");
  canvas.width = 200;
  canvas.height = 300;
  canvas.style.margin = "0 50px";
  container.appendChild(canvas);

  const code = document.createElement("div");
  code.style.width = "300px";
  code.style.textAlign = "center";
  code.style.cursor = "default";
  code.style.transform = "translate(-300px, 115px)";
  container.appendChild(code);

  var ctx = canvas.getContext("2d");
  var supportsTouch = "createTouch" in document;

  // bezier contructor
  function BezierHandle(x, y) {
    this.x = x;
    this.y = y;
    this.width = 8;
    this.height = 8;
  }

  BezierHandle.prototype = {
    // get the edges for easy grabby coordinates
    getSides: function () {
      this.left = this.x - this.width / 2;
      this.right = this.left + this.width;
      this.top = this.y - this.height / 2;
      this.bottom = this.top + this.height;
    },

    draw: function () {
      // figure out the edges
      this.getSides();
      ctx.fillStyle = "#222";
      ctx.fillRect(this.left, this.top, this.width, this.height);
    },
  };

  // make 2 new handles
  var handles = [new BezierHandle(50, 280), new BezierHandle(150, 180)];

  function Graph() {
    this.x = 0;
    this.y = 40;
    this.height = 200;
    this.width = 200;
  }

  Graph.prototype = {
    draw: function () {
      ctx.save();

      ctx.fillStyle = "#fff";
      ctx.fillRect(this.x, this.y, this.width, this.height);

      // the 0.5 offset is to account for stroke width to make lines sharp
      ctx.strokeStyle = "transparent";
      ctx.strokeRect(this.x, this.y, this.width, this.height);

      ctx.restore();
    },
  };

  var graph = new Graph();

  // get the x and y pos, normalized by getOffset
  function getPos(event) {
    var mouseX = event.pageX - getOffSet(event.target).left,
      mouseY = event.pageY - getOffSet(event.target).top;

    return {
      x: mouseX,
      y: mouseY,
    };
  }

  //from quirksmode.org. Modified slightly to return obj
  function getOffSet(obj) {
    var curtop = 0;
    var curleft = 0;
    if (obj.offsetParent) {
      do {
        curleft += obj.offsetLeft;
        curtop += obj.offsetTop;
      } while ((obj = obj.offsetParent));

      return {
        left: curleft,
        top: curtop,
      };
    }
  }

  var drag = false,
    draggingObj,
    oldX,
    oldY;

  function onPress(event) {
    //console.log('press')

    // to get rid of text cursor
    event.preventDefault();
    event.stopPropagation(); //not sure if this is needed

    var cursorEvent = supportsTouch ? event.touches[0] : event;

    var mouseCoordinates = getPos(cursorEvent),
      x = mouseCoordinates.x,
      y = mouseCoordinates.y;

    //check to see if over any handles
    for (var i = 0; i < handles.length; i++) {
      var current = handles[i],
        curLeft = current.left,
        curRight = current.right,
        curTop = current.top,
        curBottom = current.bottom;

      //20 px padding for chubby fingers
      if (supportsTouch) {
        curLeft -= 20;
        curRight += 20;
        curTop -= 20;
        curBottom += 20;
      }

      //console.log('current.x:',current.x, 'current.y:',current.y)
      if (x >= curLeft && x <= curRight && y >= curTop && y <= curBottom) {
        //over the current handle
        //console.log('over')
        //drag = true;
        draggingObj = current;
        oldX = event.pageX;
        oldY = event.pageY;

        document.addEventListener("mouseup", onRelease, false);
        document.addEventListener("touchend", touchEnd, false);

        document.addEventListener("mousemove", onMove, false);
        document.addEventListener("touchmove", touchMove, false);
      }
    }
  }

  function onMove(event) {
    var cursorEvent = supportsTouch ? event.touches[0] : event;

    var x = cursorEvent.pageX - getOffSet(canvas).left,
      y = cursorEvent.pageY - getOffSet(canvas).top;

    if (x > graph.width) {
      x = graph.width;
    }
    if (x < 0) {
      x = 0;
    }
    if (y > canvas.height) {
      y = canvas.height;
    }
    if (y < 0) {
      y = 0;
    }

    draggingObj.x = x;
    draggingObj.y = y;

    updateDrawing();
  }

  function touchMove(event) {
    onMove(event);
    event.preventDefault();
  }

  function onRelease(event) {
    //console.log('release')
    drag = false;
    document.removeEventListener("mousemove", onMove, false);
    document.removeEventListener("touchmove", touchMove, false);
    document.removeEventListener("mouseup", onRelease, false);
    document.removeEventListener("touchend", touchEnd, false);
  }

  function touchEnd(event) {
    onRelease(event);
    event.preventDefault();
  }

  canvas.addEventListener("mousedown", onPress, false);
  canvas.addEventListener(
    "touchstart",
    function touchPress(event) {
      onPress(event);
      event.preventDefault();
    },
    false
  );

  function updateDrawing() {
    // clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw graph
    graph.draw();

    // get handles
    var cp1 = handles[0],
      cp2 = handles[1];

    // draw bezier curve
    ctx.save();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(graph.x, graph.y + graph.height);
    //start at bottom left, first handle is cp1, second handle is cp2, end is top right
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, graph.width, graph.y);
    ctx.stroke();
    ctx.restore();

    // draw anchor point lines
    ctx.strokeStyle = "black";
    ctx.beginPath();
    ctx.moveTo(graph.x, graph.y + graph.height);
    ctx.lineTo(cp1.x, cp1.y);
    ctx.moveTo(graph.width, graph.y);
    ctx.lineTo(cp2.x, cp2.y);
    ctx.stroke();

    // draw handles
    for (var i = 0; i < handles.length; i++) {
      handles[i].draw();
    }

    //console.log(cp1.x, cp1.y, cp2.x, cp2.y)

    // output code
    var x1 = (cp1.x / graph.width).toFixed(3),
      y1 = ((graph.height + graph.y - cp1.y) / graph.height).toFixed(3),
      x2 = (cp2.x / canvas.width).toFixed(3),
      y2 = ((graph.height + graph.y - cp2.y) / graph.height).toFixed(3);

    // output code snippets
    code.innerHTML = x1 + ", " + y1 + ", " + x2 + ", " + y2;
    onChange(`${x1}, ${y1}, ${x2}, ${y2}`);
  }

  var coordinates = initialCurve.split(","),
    cp1 = handles[0],
    cp2 = handles[1];

  cp1.x = coordinates[0] * graph.width;
  cp1.y = graph.y + graph.height - coordinates[1] * graph.height;
  cp2.x = coordinates[2] * graph.width;
  cp2.y = graph.y + graph.height - coordinates[3] * graph.height;

  updateDrawing();
}
