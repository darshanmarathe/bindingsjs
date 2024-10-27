var __initBindings = () => {

    const bindings = document.querySelectorAll("bindings  binding");

    const model = {};
   
    if (!String.prototype.format) {
      String.prototype.format = function (_model) {
        return this.replace(/{(\w+)}/g, (match, key) => _model[key]);
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
  
      const elemToBind = () =>  document.querySelectorAll(source);
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
                e.detail || e.target.value || e.target,
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
