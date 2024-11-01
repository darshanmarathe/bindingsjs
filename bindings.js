var __initBindings = () => {

  const bindings = document.querySelectorAll("bindings  binding");

  function signal(data = {}, name = '') {

    /**
     * Emit a custom event
     * @param  {String} name   The unique name for the signal
     * @param  {*}      detail Any details to pass along with the event
     */
    function emit(name, detail = {}) {

      // Create a new event
      let event = new CustomEvent(`signal:${name}`, {
        bubbles: true,
        detail: detail
      });

      // Dispatch the event
      return document.dispatchEvent(event);

    }

    /**
     * Create a Proxy handler object
     * @param  {Object} data The data object
     * @param  {String} name The signal name
     * @return {Object}      The handler object
     */
    function handler(data, name) {
      return {
        get(obj, prop) {
          if (prop === '_isProxy') return true;
          let nested = ['[object Object]', '[object Array]'];
          let type = Object.prototype.toString.call(obj[prop]);
          if (nested.includes(type) && !obj[prop]._isProxy) {
            obj[prop] = new Proxy(obj[prop], handler(name, data));
          }
          return obj[prop];
        },
        set(obj, prop, value) {

          if (obj[prop] === value) return true;
          console.log(prop + " " + name + "[post]" + " " + value)
          obj[prop] = value;
          emit(name, { prop, value, action: 'set' });
          return true;
        },
        deleteProperty(obj, prop) {
          delete obj[prop];
          emit(name, { prop, value: obj[prop], action: 'delete' });
          return true;
        }
      };
    }

    // Create a new Proxy
    return new Proxy(data, handler(data, name));

  }

  // Create a reactive signal
  let model = signal({}, 'model');

  // Listen for signal:cart events
  document.addEventListener('signal:model', (event) => {
    if (event.detail.action === 'set') {
      debugger;
      Array.from(bindings)
        .filter(b => {
          if (!b.getAttribute("targetFormat")) return false;
          return b.getAttribute("targetFormat")?.indexOf(event.detail.prop) > -1;
        })
        .forEach((binding) => {
          console.log(binding);
          const property = event.detail.prop;
          const targetFormat = binding.getAttribute("targetFormat");
          const sourceProperty = binding.getAttribute("property");
          const target = binding.getAttribute("target");
          const targetElement = document.querySelectorAll(target);
          function isObject(value) {
            return value && typeof value === 'object' && !Array.isArray(value);
          }
          Array.from(targetElement).forEach((telem) => {
            setObject(sourceProperty, event.detail.value,
              telem, targetFormat, isObject(event.detail.value), null, property);
          });
        });
    }
  });

  if (!String.prototype.format) {
    String.prototype.format = function (_model) {
      console.log(_model)
      return this.replace(/{(\w+)}/g, (match, key) => _model[key] || "");
    };
  }

  const onElementRemoved = (element, callback) => {
    console.log(element, "element");
    new MutationObserver(function (mutations) {
      if (!document.body.contains(element)) {
        callback();
        this.disconnect();
      }
    }).observe(element.parentElement, { childList: true });
  };

  function getFunc(str, rootObject = window) {
    let props = str.split(".");
    let currObj = rootObject;

    props.forEach((prop, i) => {
      currObj = currObj[prop];
    });

    return currObj;
  }


  function setObject(
    str,
    value,
    rootObject,
    targetFormat,
    isObject,
    sourceproperty,
    xModel
  ) {
    let props = str.split(".");
    let currObj = rootObject;

    const lastIndex = props.length - 1;
    const lastProp = props[lastIndex];
    props.forEach((prop, i) => {
      if (i == lastIndex) return;
      currObj = currObj[prop];
    });

    if (sourceproperty && sourceproperty !== "") {
      value = value.getAttribute(sourceproperty);
    }

    if (isObject) {
      currObj[lastProp] = value;
      return;
    }
    if (targetFormat.startsWith("+")) {
      targetFormat = targetFormat.substring(1);
      currObj[lastProp] = currObj[lastProp] + targetFormat.format(value);
    } else {
      if (xModel) {
        model[xModel] = value;
      }
      currObj[lastProp] = (targetFormat == "") ? value : targetFormat.format(model);

    }
  }

  bindings.forEach((binding) => {
    const source = binding.getAttribute("source");
    const event = binding.getAttribute("event");
    const target = binding.getAttribute("target");
    const property = binding.getAttribute("property");
    const sourceproperty = binding.getAttribute("sourceproperty");
    const pipe = binding.getAttribute("pipe");
    const targetFormat = binding.getAttribute("targetFormat") || "";
    const isObject = binding.hasAttribute("object");
    const xModel = binding.getAttribute("x-model");

    const elemToBind = () => document.querySelectorAll(source);
    const targetElement = () => document.querySelectorAll(target);
    if (!(pipe != undefined && pipe.trim() != "")) {
      if (elemToBind().length === 0 || targetElement().length === 0) {
        console.error(
          "source element ",
          elemToBind,
          " or target element",
          targetElement,
          " not found"
        );
        return;
      }
    }


    // set default value for x-model
    if (xModel) {
      model[xModel] = elemToBind()[0].detail || elemToBind()[0].value;
    }

    const Action = function (e) {
      if (pipe != undefined && pipe.trim() != "") {
        let func = getFunc(pipe);
        if (typeof func !== "function") {
          console.error("function with name " + pipe + "not found.");
          return;
        }
        func(e, targetElement);
        return;
      }

      targetElement().forEach((telem) => {
        if (sourceproperty && sourceproperty !== "") {
          setObject(
            property,
            e.target,
            telem,
            targetFormat,
            isObject,
            sourceproperty,
            xModel
          );
        } else {
          setObject(
            property,
            e.detail || e.target.value, // || e.target,
            telem,
            targetFormat,
            isObject,
            sourceproperty,
            xModel
          );
        }
      });
    };

    elemToBind().forEach((elem) => {

      onElementRemoved(elem, function () {
        console.log(elem, " removed from ", event);
        elem.removeEventListener(event, Action);
      });

      elem.addEventListener(event, Action);
    });
  });
}

document.addEventListener("DOMContentLoaded", __initBindings);
