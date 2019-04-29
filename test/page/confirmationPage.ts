class ConfirmationPage {

    CHECKMARK_ICON_SEL = '[alt="check icon"]';
    HELP_PAGE_LOCATION = '/help';

    public waitForPageToLoad() {
        try {
            browser.waitUntil(() => {
                let complete = false;
                const isCheckmarkShown = browser.isVisible(this.CHECKMARK_ICON_SEL);
                const onHelpPage = String(browser.getUrl()).includes(this.HELP_PAGE_LOCATION);

                if (onHelpPage || isCheckmarkShown) {
                    complete = true;
                }

                return complete;
            },                20000);
        } catch (err) {
            throw `Confirmation Page did not load successfully. ${err}`;
        }
    }
}

const confirmationPage = new ConfirmationPage();
export default confirmationPage;
