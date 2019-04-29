export function scrollIntoView(cssSelector) {
    browser.execute(`document.querySelector('${cssSelector}').scrollIntoView(false)`);
}

export function removeSpecialCharacters(value) {
    return value.replace(/[^\d\.]/g, '');
}