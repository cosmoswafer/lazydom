/*
 * DOM usage:
 *
 * Two cases:
 * 1. DOM methods shortcut, use normal selector to look up elements
 * 2. Lazy template, look up the template element and update its contents
 *
 * The shortcuts:
 * 1. Query element and cache them to improve the performance
 * 2. The `dot` method to quickly update set of contents
 * 3. Binding event listeners as well by the above methods
 *
 * Remarks:
 * 1. The lazy template will clone itself and clean up automatically.
 */
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
            ? this.#cloneElement(template_element, parent_node)
            : (this.element = template_element);
        this.#styleShorthand();
    }

    dot(dataset) {
        for (let d of dataset) {
            //If the second elemenmt is not empty text, set the textContent
            if (d.length >= 2 && d[1] != '') this.text(d[0], d[1]);
            //If there is attributes object, assign it
            if (d.length == 3) this.attr(d[0], d[2]);
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

    #cloneElement(template_element, parent_node) {
        this.element = template_element.cloneNode(true);
        parent_node.append(this.element);
        this.#cleanUp(template_element);
    }

    #cleanUp(target) {
        //Remove the duplicated class which cloned from template
        if (this.#isLazy(this.element))
            this.element.classList.remove(DOM.template_placeholder);
        //We could hide the template by default, show our element after cloned
        if (this.element.style.display === 'none')
            this.element.style.display = '';
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
            DOM.events.includes(k)
                ? target_element.addEventListener(...p)
                : target_element.setAttribute(...p);
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

export class Router {
    static #router = null;

    constructor(default_page = '') {
        if (Router.#router != null) return Router.#router;

        Router.#router = this;
        this.current_page = default_page;
        this.pages = [];
        window.addEventListener('hashchange', this.#pageChange);
    }

    addPages(...ids) {
        ids.forEach((p) => this.pages.push(p));
    }

    #pageChange = (e) => {
        const page_id = location.hash.replace('#', '');
        this.render(page_id);
    };

    render(page_id) {
        if (!this.pages.includes(page_id)) return;

        for (let p of this.pages) {
            const p_div = document.querySelector(`#${p}`);

            if (p_div) p_div.style.display = p === page_id ? '' : 'none';
        }
    }

    goTo(page_id) {
        location.hash === `#${page_id}`
            ? this.render(page_id)
            : (location.hash = page_id);
    }
}

export class StoreBase {
    #page_store = [];

    register(page_name, dom_element, render_func, bindings = {}) {
        this.#page_store.push({
            name: page_name,
            dom: dom_element,
            rend: render_func,
        });
        for (let k in bindings) {
            this.#bindProp(dom_element, k, bindings[k]);
        }
    }

    #bindProp(page_dom, name, selector) {
        if (name in this) return; //Avoid redefine

        Object.defineProperty(this, name, {
            get() {
                return page_dom.q(selector).textContent;
            },
            set(value) {
                page_dom.text(selector, value);
            },
        });
    }

    notify() {
        this.#page_store.forEach((i) => i.rend());
    }
}

/*
 * The Router could switch between pages by the url anchor hash.
 * Just implement the PageBase class.
 * There are two methods to switch pages:
 * 1. Native anchor url, i.e. '#pageName'
 * 2. The `show()` method of a Page instance
 */
export class PageBase {
    router = new Router();
    #pid;
    page_name;

    constructor(page_name) {
        this.#pid = page_name;
        this.page_name = page_name;
        this.router.addPages(this.#pid);
        //Convert page name into CSS id format
        this.dom = new DOM(`#${this.#pid}`);
    }

    show() {
        this.router.goTo(this.#pid);
    }
}
