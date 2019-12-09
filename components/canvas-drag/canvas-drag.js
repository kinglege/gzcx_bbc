const defaultOptions = {
    selector: '#canvas-drag'
};

function CanvasDrag(options = {}) {
    options = {
        ...defaultOptions,
        ...options,
    };

    const pages = getCurrentPages();
    const ctx = pages[pages.length - 1];

    const canvasDrag = ctx.selectComponent(options.selector);
    delete options.selector;

    return canvasDrag;
};

CanvasDrag.export = () => {
    const canvasDrag  = CanvasDrag();
    if (!canvasDrag) {
        console.error('请设置组件的id="canvas-drag"!!!');
    } else {
        return CanvasDrag().export();
    }
}

CanvasDrag.getSelect = () => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
    console.error('请设置组件的id="canvas-drag"!!!');
  } else {
    return CanvasDrag().getSelect();
  }
}

CanvasDrag.select = () => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
    console.error('请设置组件的id="canvas-drag"!!!');
  } else {
    return CanvasDrag().select();
  }
}
CanvasDrag.changFontColor = (color, text) => {
    const canvasDrag  = CanvasDrag();
    if (!canvasDrag) {
        console.error('请设置组件的id="canvas-drag"!!!');
    } else {
      return CanvasDrag().changColor(color, text);
    }
}

CanvasDrag.changFontText = (text) => {
  const canvasDrag = CanvasDrag();
  if (!canvasDrag) {
    console.error('请设置组件的id="canvas-drag"!!!');
  } else {
    return CanvasDrag().changText(text);
  }
}

CanvasDrag.changeBgColor = (color) => {
    const canvasDrag  = CanvasDrag();
    if (!canvasDrag) {
        console.error('请设置组件的id="canvas-drag"!!!');
    } else {
      return CanvasDrag().changeBgColor(color);
    }
}

CanvasDrag.changeBgImage = (imageUrl, draw_start_width,draw_start_height, bg_width, bg_hieght) => {
    const canvasDrag  = CanvasDrag();
    if (!canvasDrag) {
        console.error('请设置组件的id="canvas-drag"!!!');
    } else {
      return CanvasDrag().changeBgImage(imageUrl, draw_start_width,draw_start_height, bg_width, bg_hieght);
    }
}

export default CanvasDrag;