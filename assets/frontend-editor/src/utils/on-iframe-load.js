let dataChanger;
let cache;

const el = document.getElementById('udesly-frontend-editor');
let focusedElement;

function findReact(dom) {
    const key = Object.keys(dom).find(key=>key.startsWith("__reactProps$"));
    return dom[key];
}

el.addEventListener('click', e => {

    if (e.target.matches('[data-tooltip="Heading"]')) {
        const r = findReact(e.target);
        if (r && typeof r.onClick == "function") {

            r.onClick(e);

        }
        return;
    }
    if (e.target.closest('[data-tooltip="Heading"]')){
        const r = findReact(e.target.closest('[data-tooltip="Heading"]'));
        if (r && typeof r.onClick == "function") {
            r.onClick(e);
        }
        return;
    }

    const p = e.target.closest('[class^=FieldWrapper]');
    if (focusedElement) {
        focusedElement.classList.remove('fe-focused');
    }
    if (p) {
        const label = p.querySelector('label');
        if (!label || !label.htmlFor) {
            return;
        }
        const els = cache.get(label.htmlFor);
        if (els[0]) {
            els[0].classList.add('fe-focused');
            if (focusedElement && focusedElement !== els[0]) {
                focusedElement.__scrolled = false;
            }
            focusedElement = els[0];
            if (!els[0].__scrolled) {
                els[0].scrollIntoView({ behavior: 'smooth', block: 'center'});
                els[0].__scrolled = true;
            }
        }

    }
})

export function onIframeLoad(iframe) {
    const doc = iframe.contentDocument;
    const style = doc.createElement('style');
    style.textContent = `.fe-focused { box-shadow: 0 0 0 2px #2296fe; border-radius: 5px; }  ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:transparent;border-style:solid;border-width:0}::-webkit-scrollbar-thumb{border-radius:100px;background:#2296fe}`
    doc.head.append(style);

    doc.addEventListener('click', e => {
        e.preventDefault();

        e.stopPropagation();

        const target = e.target.matches('[data-link]') ? e.target: e.target.closest('[data-link]');

        if (target) {
            const href = target.getAttribute('href');
            if (!href.includes("/")) {
                document.dispatchEvent(new CustomEvent('udesly-fe.notice', {
                    detail: {
                        type: 'info',
                        message: `This link will go to a page with slug: "${href}"`
                    }
                }))
            } else {
                document.dispatchEvent(new CustomEvent('udesly-fe.notice', {
                    detail: {
                        type: 'info',
                        message: `This link will go to: "${href}"`
                    }
                }))
            }
        }
    })

    const config = JSON.parse(doc.getElementById('udesly-fe-data').textContent);

    dataChanger = new DataChanger(iframe);
    cache = new WeakCache(iframe.contentDocument);

    const pageConfig = parseConfig(config.page, "Edit Page", config.template);

    const globalConfig = parseConfig(config.global, "Symbols", "global");

    document.dispatchEvent(new CustomEvent('udesly-fe.init', {
        detail: {
            pageConfig,
            globalConfig,
            iframe
        }
    }))

}

function parseConfig(config, label = 'Edit Page', template) {
    const formConfig = {
        id: "random-" + Math.random(),
        label,
        fields: [],
        initialValues: {
            img: {},
            link: {},
            text: {},
            textarea: {},
            richtext: {}
        },
        onSubmit: async (formData) => {
            // save the new form data
            const dataToSend = JSON.parse(JSON.stringify(formData));

            for(let imgKey in dataToSend.img) {
                if(dataToSend.img[imgKey].id && dataToSend.img[imgKey].id !== "local") {
                    console.log(dataToSend.img[imgKey].id)
                    dataToSend.img[imgKey] = {
                        id: dataToSend.img[imgKey].id
                    }
                } else {
                    dataToSend.img[imgKey] = dataToSend.img[imgKey]._original
                }
            }

            console.log(dataToSend);

            const ajaxData = new FormData();
            ajaxData.append('action', "update_frontend_editor_data");
            ajaxData.append( 'security', window.options.save_nonce);
            ajaxData.append('data', JSON.stringify(dataToSend));
            ajaxData.append('template', template);


            const res = await fetch(window.options.ajax_url, {
                method: "POST",
                body: ajaxData,
                contentType: 'application/json',
                credentials: 'same-origin'
            });

            if (res.ok) {
                const json = await res.json();
                if (json.success) {
                    document.dispatchEvent(new CustomEvent('udesly-fe.notice', {
                        detail: {
                            type: 'success',
                            message: `Saved successfully!`
                        }
                    }))
                } else {
                    document.dispatchEvent(new CustomEvent('udesly-fe.notice', {
                        detail: {
                            type: 'error',
                            message: json.data || "Failed to save data! :("
                        }
                    }))
                }


            } else {
                document.dispatchEvent(new CustomEvent('udesly-fe.notice', {
                    detail: {
                        type: 'error',
                        message: `Failed to save data! :(`
                    }
                }))
            }
        },
    }

    const fieldGroups = {};

    for (let key in config.img) {
        if (!fieldGroups.img) {
            fieldGroups.img = {
                name: "img",
                component: "group",
                label: "Images",
                fields: []
            }
        }


        fieldGroups.img.fields.push({
            name: key,
            component: 'image',
            clearable: false,
            parse: (value, name) => {
                dataChanger.changeImage(name, value.previewSrc);
                return value;
            },
        });
        formConfig.initialValues.img[key] = config.img[key];
    }
    for (let key in config.link) {
        if (!fieldGroups.link) {
            fieldGroups.link = {
                name: "link",
                component: "group",
                label: "Links",
                fields: [
                    {
                        name: 'null',
                        component: () => <div>You have different ways to set your links:
                        <ul style={{whiteSpace: "break-spaces", fontSize: "80%"}}>
                            <li><strong>Absolute or Relative:</strong> for example https://www.mysite.com, tel:+333333 or /home#about</li>
                            <li><strong>Page slug:</strong> if you want to link to an inner page you should use the page slug, for example "about", "nested/page" or "index" to link to home page</li>
                        </ul>
                        </div>,

                    }
                ]
            }
        }
        fieldGroups.link.fields.push({
            name: key,
            component: 'text',
            parse: (value, name) => {
                dataChanger.changeAttribute(name, value, "href");
                return value;
            },
        });
        formConfig.initialValues.link[key] = config.link[key];
    }
    for (let key in config.text) {
        if (!fieldGroups.text) {
            fieldGroups.text = {
                name: "text",
                component: "group",
                label: "Texts",
                fields: []
            }
        }
        fieldGroups.text.fields.push({
            name: key,
            component: config.text[key].length > 35 ? 'textarea':'text',
            parse: (value, name) => {
                dataChanger.changeInnerHTML(name, value);
                return value;
            },
        });
        formConfig.initialValues.text[key] = config.text[key];
    }
    for (let key in config.textarea) {
        if (!fieldGroups.textarea) {
            fieldGroups.textarea = {
                name: "textarea",
                component: "group",
                label: "Text Areas",
                fields: []
            }
        }
        fieldGroups.textarea.fields.push({
            name: key,
            component: 'html',
            parse: (value, name) => {
                dataChanger.changeInnerHTML(name, value);
                return value;
            },
        });
        formConfig.initialValues.textarea[key] = config.textarea[key];
    }
    for (let key in config.richtext) {
        if (!fieldGroups.richtext) {
            fieldGroups.richtext = {
                name: "richtext",
                component: "group",
                label: "Rich Texts",
                fields: []
            }
        }
        fieldGroups.richtext.fields.push({
            name: key,
            component: 'html',
            imageProps: {
                parse: (media) => media.previewSrc,
                directory: () => "",
              previewSrc: (media) => {
                  return media;
              }
            },
            parse: (value, name) => {
                dataChanger.changeInnerHTML(name, value);
                return value;
            },
        });
        formConfig.initialValues.richtext[key] = config.richtext[key];
    }

    formConfig.fields.push(...Object.values(fieldGroups))

    return formConfig;
}

class WeakCache {
    cache = {}

    constructor(iframe) {
        this.doc = iframe;
    }


    get(key) {
        const [type, name] = key.split('.');
        if (!this.cache[key]) {
            this.cache[key] = this.doc.querySelectorAll(`[data-${type}="${name}"]`);
        }
        return this.cache[key];
    }
}

class DataChanger {

    constructor(iframe) {
        this.document = iframe.contentDocument;
    }

    changeInnerHTML(name, value) {
        const el = cache.get(name);
        el.forEach(el => {
            el.innerHTML = value;
        })
    }

    changeAttribute(name, value, key) {
        const el = cache.get(name);
        el.forEach(el => {
            el.setAttribute(key, value);
        });
    }

    changeImage(name, value) {
        const el = cache.get(name);
        el.forEach(el => {
            if (el.tagName === "IMG") {
                el.removeAttribute('srcset');
                el.removeAttribute('sizes');
                el.setAttribute("src", value);
            } else {
                el.setAttribute('style', `background-image: url('${value}')`);
            }
        })
    }


}