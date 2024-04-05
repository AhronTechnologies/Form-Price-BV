const MOUSE_LEFT = 1;

class Slider {
  /**
   * @param {HTMLElement} container generated html goes here
   * @param {HTMLElement} range the range input to bind to (and hide)
   * @param {(function(number) : string) | undefined} thumbContentFormat override the default thumb content
   * @param {(function(number) : string|undefined) | undefined} popupFormat define popup format
   * @param {number[] | undefined} allowedValues optional list of allowed values
   * */
  constructor(
    container,
    range,
    thumbContentFormat = undefined,
    popupFormat = undefined,
    allowedValues = undefined,
  ) {
    console.assert(range.tagName === "INPUT");
    console.assert(range.getAttribute("type") === "range");

    /** @type {HTMLElement} */
    this._container = container;
    /** @type {HTMLElement} */
    this._range = range;
    /** @type {function(number) : string} */
    this.thumbContentFormat = thumbContentFormat ?? ((value) => "" + value);
    /** @type {function(number) : string | undefined} */
    this.popupFormat = popupFormat ?? ((_) => undefined);
    /** @type {number[] | undefined} */
    this.allowedValues = allowedValues;
  }

  init() {
    function createStepButton(content) {
      const btn = document.createElement("button");
      btn.classList.add("step-button");
      btn.innerHTML = content;
      btn.type = "button";
      return btn;
    }

    const containerInner = document.createElement("div");
    containerInner.classList.add("slider-container-inner");
    this._container.appendChild(containerInner);

    const btnDecrement = createStepButton("-");
    btnDecrement.addEventListener("click", () => {
      this._increment(-1);
    });
    containerInner.appendChild(btnDecrement);

    const track = document.createElement("div");
    track.classList.add("track");
    containerInner.appendChild(track);
    /** @type {HTMLElement} */
    this.track = track;
    track.addEventListener("click", (e) => {
      this._updateOnMouseEvent(e);
    });
    track.addEventListener("mousedown", (e) => {
      this._onTrackMouseDown(e);
    });

    const barLeft = document.createElement("div");
    barLeft.classList.add("bar-left");
    track.appendChild(barLeft);
    /** @type {HTMLElement} */
    this._barLeft = barLeft;

    const barRight = document.createElement("div");
    barRight.classList.add("bar-right");
    track.appendChild(barRight);

    const thumb = document.createElement("div");
    thumb.classList.add("thumb");
    track.appendChild(thumb);
    /** @type {HTMLElement} */
    this._thumb = thumb;

    const thumbValue = document.createElement("div");
    thumb.appendChild(thumbValue);
    /** @type {HTMLElement} */
    this._thumbValue = thumbValue;

    const popup = document.createElement("div");
    popup.classList.add("popup");
    popup.innerHTML = "test";
    thumb.appendChild(popup);
    /** @type {HTMLElement} */
    this._popup = popup;

    const btnIncrement = createStepButton("+");
    btnIncrement.addEventListener("click", () => {
      this._increment(1);
    });
    containerInner.appendChild(btnIncrement);

    this._range.style.display = "none";

    this._updateRangeValue(this._rangeValue);

    document.addEventListener("mousemove", (e) => {
      this._onDocumentMouseMove(e);
    });
    document.addEventListener("mouseup", (e) => {
      this._onDocumentMouseUp(e);
    });
  }

  /**
   * @returns {number}
   * */
  get _min() {
    return parseFloat(this._range.min);
  }

  /**
   * @returns {number}
   * */
  get _max() {
    return parseFloat(this._range.max);
  }

  /**
   * @returns {number}
   * */
  get _step() {
    let ret = parseFloat(this._range.step);
    if (isNaN(ret)) {
      ret = 1;
    }
    return ret;
  }

  /**
   * @returns {number}
   * */
  get _rangeValue() {
    return parseFloat(this._range.value);
  }

  /**
   * @param {number} mul
   * */
  _increment(mul) {
    let newValue = undefined;

    if (this.allowedValues === undefined) {
      newValue = this._rangeValue + this._step * mul;
    } else {
      const nearest = this._findNearestAllowedValue(this._rangeValue);
      const nearestIndex = this.allowedValues.indexOf(nearest);
      let newIndex = nearestIndex + Math.sign(mul);
      newIndex = Math.max(0, Math.min(this.allowedValues.length - 1, newIndex));
      newValue = this.allowedValues[newIndex];
    }

    this._updateRangeValue(newValue);
  }

  /**
   * @param {number} newValue
   * */
  _updateRangeValue(newValue) {
    newValue = Math.max(this._min, Math.min(this._max, newValue));

    if (this.allowedValues !== undefined) {
      newValue = this._findNearestAllowedValue(newValue);
    }

    this._range.value = newValue;
    this._range.dispatchEvent(new Event("input"));

    // calling _rangeValue here because it might be influenced by the step
    this._thumbValue.innerHTML = this.thumbContentFormat(this._rangeValue);

    const popupValue = this.popupFormat(this._rangeValue);
    if (popupValue) {
      this._popup.innerHTML = popupValue;
      this._popup.style.display = "inline";
    } else {
      this._popup.style.display = "none";
    }

    this._updateThumbPosition();
  }

  _findNearestAllowedValue(newValue) {
    console.assert(this.allowedValues !== undefined);

    let nearestIndex = undefined;
    let nearestDiff = Infinity;
    for (let i = 0; i < this.allowedValues.length; i++) {
      const val = this.allowedValues[i];
      const diff = Math.abs(val - newValue);
      if (diff < nearestDiff) {
        nearestIndex = i;
        nearestDiff = diff;
      }
    }

    return this.allowedValues[nearestIndex];
  }

  _updateThumbPosition() {
    const percent =
      (this._rangeValue - this._range.min) /
      (this._range.max - this._range.min);

    const thumbCenterNew =
      percent * (this.track.clientWidth - this._thumb.clientWidth) +
      this._thumb.clientWidth / 2;

    this._barLeft.style.width = `${thumbCenterNew}px`;

    const pxOffset = thumbCenterNew - this._thumb.clientWidth / 2;

    this._thumb.style.left = `${pxOffset}px`;
  }

  /**
   * @param {MouseEvent} e
   * */
  _updateOnMouseEvent(e) {
    const rect = this.track.getBoundingClientRect();
    const x = e.clientX - rect.left;

    let percent =
      (x - this._thumb.clientWidth / 2) /
      (this.track.clientWidth - this._thumb.clientWidth);

    let newValue = percent * (this._max - this._min) + this._min;

    newValue = Math.round(newValue);

    this._updateRangeValue(newValue);
  }

  /**
   * @param {MouseEvent} e
   * */
  _onDocumentMouseMove(e) {
    if (this.isDragging) {
      this._updateOnMouseEvent(e);
    }
  }

  /**
   * @param {MouseEvent} e
   * */
  _onDocumentMouseUp(e) {
    if ((e.buttons & MOUSE_LEFT) == 0) {
      this.isDragging = false;
    }
  }

  /**
   * @param {MouseEvent} e
   * */
  _onTrackMouseDown(e) {
    if ((e.buttons & MOUSE_LEFT) != 0) {
      this.isDragging = true;
    }
  }
}
