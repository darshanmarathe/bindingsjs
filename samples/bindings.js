document.addEventListener("DOMContentLoaded", () => {
    var bindings = document.querySelectorAll('bindings  binding')
    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ?
                    args[number] :
                    match;
            });
        };
    }

    function getFunc(str, rootObject = window) {
        let props = str.split('.')
        let currObj = rootObject;

        props.forEach((prop, i) => {
            currObj = currObj[prop]
        });

        return currObj
    }

    function setObject(str, value, rootObject, targetFormat, isObject) {
        let props = str.split('.')
        let currObj = rootObject;

        const lastIndex = (props.length - 1)
        const lastProp = props[lastIndex]
        props.forEach((prop, i) => {
            if (i == lastIndex) return;
            currObj = currObj[prop]
        });

        debugger;
        
        if (isObject)
        {
            currObj[lastProp] = value;
            return;
        }
        if (targetFormat.startsWith("+")) {
            targetFormat = targetFormat.substring(1);
            currObj[lastProp] = currObj[lastProp] + targetFormat.format(value);
        } else
            currObj[lastProp] = targetFormat.format(value);
        
    }

    bindings.forEach(binding => {

        const source = binding.getAttribute('source');
        const event = binding.getAttribute('event');
        const target = binding.getAttribute('target');
        const property = binding.getAttribute('property');
        const pipe = binding.getAttribute('pipe');
        const targrtFormat = binding.getAttribute('targrtFormat') || "{0}";
        const isObject = binding.hasAttribute('object');

        const elemToBind = document.querySelector(source);
        const targetElement = document.querySelector(target);
        if (!(pipe != undefined && pipe.trim() != "")) {
            if (elemToBind == null || targetElement == null) {
                console.error("source element ", elemToBind, " or target element", targetElement, " not found")
                return;
            }

        }

        elemToBind.addEventListener(event, function (e) {

            if (pipe != undefined && pipe.trim() != "") {
                let func = getFunc(pipe);
                func(e, targetElement);
                return;
            }

            setObject(property, (e.detail || e.target.value), targetElement, targrtFormat , isObject);
        })
    })



});