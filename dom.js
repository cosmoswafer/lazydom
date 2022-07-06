export class DOM {
    static template_placeholder = 'lazydom';
    static events = ['click', 'change'];

    static CACHE = new Map();

    element;
    style;
    classList;

    constructor(
        selector = `.${DOM.template_placeholder}`,
        parent_node = document
    ) {
        const template_element = this.#lookup(selector, parent_node);
        this.#isLazy(template_element)
            ? this.#cloneElement(template_element)
            : (this.element = template_element);
        this.#styleShorthand();
    }

    dot(...dom_array) {
        for (let d of dom_array) {
            const selector = d[0];
            const textContent = d[1];
            const attributes = d[2];

            //If the second elemenmt is not empty text, set the textContent
            if (d.length > 2 && textContent != '' || d.length == 2) this.text(selector, textContent);
            //If there is attributes object, assign its values
            if (d.length == 3) this.attr(selector, attributes);
        }

        return this;
    }

    DOM(selector = `.${DOM.template_placeholder}`) {
        return new DOM(selector, this.element);
    }

    q(selector) {
        return this.#lookup(selector, this.element);
    }

    a(selector) {
        return this.element.querySelectorAll(selector);
    }

    static fromElement(element) {
        const n = new DOM();
        //Updating the element and its shorthand
        n.element = element;
        n.#styleShorthand();
        return n;
    }

    #styleShorthand() {
        this.style = this.element?.style;
        this.classList = this.element?.classList;
    }

    #isLazy(target) {
        return target?.classList.contains(DOM.template_placeholder);
    }

    #cloneElement(template_element) {
        const parent_node = template_element.lazyParent ?? template_element.parentElement;
        this.element = template_element.cloneNode(true);
        parent_node.append(this.element);
        this.#cleanUp(template_element);
    }

    #cleanUp(target) {
        //Remove the duplicated class which cloned from template
        if (this.#isLazy(this.element))
            this.element.classList.remove(DOM.template_placeholder);
        //Save the parent element before removing from DOM tree
        if (! target.lazyParent) target.lazyParent = target.parentElement;
        //Remove the lazy template element from dom tree to save our time
        if (this.#isLazy(target)) target.remove();
    }

    #lookup(selector, parent_node) {
        if (!DOM.CACHE.has(parent_node)) DOM.CACHE.set(parent_node, new Map());
        const map = DOM.CACHE.get(parent_node);
        if (!map.has(selector))
            map.set(selector, parent_node.querySelector(selector));
        return map.get(selector);
    }

    #setAttr(target_element, attributes) {
        for (let k in attributes) {
            const p = [k, attributes[k]];
            if (Dom.events.includes(k)) {
                target_element.addEventListener(...p)
            } else if (target_element.nodeName === 'INPUT' && k === 'value') {
                target_element.value = attributes[k];
            } else {
                target_element.setAttribute(...p);
            }
        }
    }

    attr(selector, attributes) {
        this.element
            .querySelectorAll(selector)
            .forEach((i) => this.#setAttr(i, attributes));
    }

    text(selector, value) {
        this.element
            .querySelectorAll(selector)
            .forEach((i) => (i.textContent = value));
    }
}

