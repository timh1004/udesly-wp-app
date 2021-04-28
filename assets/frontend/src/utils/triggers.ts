

export function triggerJQuery(event, data = null) {
    setTimeout(
        () => {
            jQuery(document.body).trigger(event, data)
        }, 1
    )
}

export function onJQueryEvent(event, callback, target = document.body) {
    jQuery(target).on(event, callback);
}