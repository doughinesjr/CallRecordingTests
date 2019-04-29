import { scrollIntoView, removeSpecialCharacters } from '../utils/coreHelper';
import confirmationPage from './confirmationPage';

class ShoppingCartPage {

    public URL = 'http://shoppingcart-staging.avoxi.io/';
    public VISIBLE_BUTTON_PREFIX = '[aria-hidden=false]';
    public COUNTRY_SELECT_SEL = '#originatingCountrySelect';
    public STANDARD_SELECTION_BTN_SEL = `${this.VISIBLE_BUTTON_PREFIX} #businessStandardButton p`;
    public ADVANCED_SELECTION_BTN_SEL = `${this.VISIBLE_BUTTON_PREFIX} #businessAdvancedButton p`;
    public CALL_RECORDING_CHECKBOX_SEL = 'label[for="0checkBox"]';
    public FIRST_NAME_INPUT_SEL = '#firstName';
    public LAST_NAME_INPUT_SEL = '#lastName';
    public BUSINESS_NAME_SEL = '#businessName';
    public BUSINESS_EMAIL_SEL = '#email';
    public CONTINUE_BUTTON_SEL = '#newCustomerButton';
    public MODAL_CONTINUE_BUTTON = '#continueShoppingPromoButton .fl-button-text';
    public SELECTED_PHONE_NUMBER_DROPDOWN_SEL = 'select[name=number]';
    public CREDIT_CARD_NAME_INPUT_SEL = '[name=billingName]';
    public CREDIT_CARD_NUMBER_INPUT_SEL = '[name=billingCardNumber]';
    public CREDIT_CARD_CVC_INPUT_SEL = '[name=billingCVC]';
    public ACCEPT_TERMS_CHECKMARK_SEL = 'label[for=finalCheckBox]';
    public PLACE_ORDER_BUTTON_SEL = '#placeOrder';
    public STANDARD_PRICE_SEL = '#businessStandardPrice';
    public TOTAL_PRICE_SEL = '//*[@id="cartCard"]//*[preceding-sibling::div[.="Total"]]//*[contains(., "/mo")]';
    public CALL_RECORDING_LABEL_IN_SHOPPING_CART = '//*[@id="cartCard"]//div[.="Call Recording"]';

    public goToShoppingCartPage() {
        browser.url(this.URL);
        this.waitForPageToLoad();
    }

    public waitForPageToLoad() {
        try {
            browser.waitForVisible(this.COUNTRY_SELECT_SEL);
            this.waitForPhoneNumberInventoryToLoad();
        } catch (err) {
            throw `Error on page load. ${err}`;
        }
    }
    
    /**
     * This function waits for the phone number in the "Select a Phone Number" section to load.
     * This wait must be done after loading the page. If skipped, currently a white screen will display.
     */
    public waitForPhoneNumberInventoryToLoad () {
        browser.waitUntil(() => {
            const value = browser.getValue(`${this.SELECTED_PHONE_NUMBER_DROPDOWN_SEL} option`);
            const done = !value.includes('Loading');
            return done;
        },                20000);

        this.hideModalIfDisplayed();

        browser.pause(1000);    // Added for additional background processing
    }

    public hideModalIfDisplayed() {
        if (browser.isVisible(this.MODAL_CONTINUE_BUTTON)) {
            browser.click(this.MODAL_CONTINUE_BUTTON);
        }
    }
    
    public clickStandardSelectButton() {
        this.clickPlanSelectionButton(this.STANDARD_SELECTION_BTN_SEL);
    }

    public clickAdvancedSelectButton() {
        this.clickPlanSelectionButton(this.ADVANCED_SELECTION_BTN_SEL);
    }

    public selectCallRecordingFeature() {
        if (!this.isCallRecordingFeatureSelected()) {
            browser.click(this.CALL_RECORDING_CHECKBOX_SEL);
        }
    }

    public deselectCallRecordingFeature() {
        if (this.isCallRecordingFeatureSelected()) {
            browser.click(this.CALL_RECORDING_CHECKBOX_SEL);
        }
    }

    public isCallRecordingFeatureSelected() {
        // This logic (if element is not selected, return true) doesn't seem logically correct.
        // But for some reason, isSelected is returning the opposite of it's status. 
        // If the checkmark is selected, browser.isSelected returns false.
        let isSelected = false;
        if (!browser.isSelected(this.CALL_RECORDING_CHECKBOX_SEL)) {
            isSelected = true;
        }
        return isSelected;
    }

    private clickPlanSelectionButton(sel) {
        try {
            browser.click(sel);

            browser.waitForExist(this.CALL_RECORDING_CHECKBOX_SEL);
        } catch (err) {
            throw `Error clicking plan selection button. ${err}`;
        }
    }

    public updateFirstNameInput(value) {
        browser.setValue(this.FIRST_NAME_INPUT_SEL, value);
    }

    public updateLastNameInput(value) {
        browser.setValue(this.LAST_NAME_INPUT_SEL, value);
    }

    public updateBusinessName(value) {
        browser.setValue(this.BUSINESS_NAME_SEL, value);
    }

    public updateBusinessEmail(value) {
        browser.setValue(this.BUSINESS_EMAIL_SEL, value);
    }

    public fillInCustomerInfo(firstName, lastName, businessName, businessEmail) {
        scrollIntoView(this.BUSINESS_EMAIL_SEL);

        this.updateFirstNameInput(firstName);
        this.updateLastNameInput(lastName);
        this.updateBusinessName(businessName);
        this.updateBusinessEmail(businessEmail);
    }

    public clickContinueButton() {
        // browser.execute(`document.querySelector("${this.CONTINUE_BUTTON}").click()`);
        browser.click(this.CONTINUE_BUTTON_SEL);
        this.waitForCreditCardSectionToAppear();
    }

    public waitForCreditCardSectionToAppear() {
        try {
            browser.waitForVisible(this.CREDIT_CARD_NAME_INPUT_SEL);
        } catch (err) {
            throw `Credit Card form does not appear. ${err}`;
        }
    }

    public fillInCreditCardInfo(name, cardNumber, cvc) {
        browser.setValue(this.CREDIT_CARD_NAME_INPUT_SEL, name);
        browser.setValue(this.CREDIT_CARD_NUMBER_INPUT_SEL, cardNumber);
        browser.setValue(this.CREDIT_CARD_CVC_INPUT_SEL, cvc);
    }

    public clickAcceptTermsCheckbox() {
        try {
            browser.click(this.ACCEPT_TERMS_CHECKMARK_SEL);
        } catch (err) {
            throw `Unable to click terms checkbox. ${err}`;
        }
    }

    public clickPlaceOrderButton() {
        browser.waitForEnabled(this.PLACE_ORDER_BUTTON_SEL);
        browser.click(this.PLACE_ORDER_BUTTON_SEL);
        confirmationPage.waitForPageToLoad();
    }

    public getStandardPrice() : number {
        const priceRaw = String(browser.getText(this.STANDARD_PRICE_SEL));
        return Number(removeSpecialCharacters(priceRaw));
    }

    public getTotalPrice() : number {
        const priceRaw = String(browser.getText(this.TOTAL_PRICE_SEL));
        return Number(removeSpecialCharacters(priceRaw));
    }
}

const shoppingCartPage = new ShoppingCartPage();
export default shoppingCartPage;
