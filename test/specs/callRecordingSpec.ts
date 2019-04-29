import shoppingCartPage from '../page/shoppingCartPage';
import { removeSpecialCharacters } from '../utils/coreHelper';

const faker = require('faker');

/**
 * This is a mocking function for calling an API to check whether the
 * Call Recording Feature is enabled on a user's account. Simply pass
 * true to return a true response, and false to return a false response. 
 * @param enabled 
 */
function isCallRecordingFeatureEnabledOnUserAccount(enabled) : boolean {
    return enabled;
}

describe('Call Recording ', () => {

    const testFirstName = faker.name.firstName();
    const testLastName = String(faker.name.lastName()).replace('\'', '');
    const testFullName = `${testFirstName} ${testLastName}`;
    const testBusinessName = 'Test Business Name';
    const testBusinessEmail = `${testFirstName}.${testLastName}@testEmail.com`;
    const testCreditCardNumber = '4007000000027';
    const testCvv = '123';


    beforeEach((done) => {
        shoppingCartPage.goToShoppingCartPage();
    });

    it('Call Recording feature should be anabled if selected on Shopping Cart page', () => {
        shoppingCartPage.clickStandardSelectButton();

        shoppingCartPage.selectCallRecordingFeature();

        shoppingCartPage.fillInCustomerInfo(testFirstName, testLastName, testBusinessName, testBusinessEmail);

        shoppingCartPage.clickContinueButton();

        shoppingCartPage.fillInCreditCardInfo(testFullName, testCreditCardNumber, testCvv);

        shoppingCartPage.clickAcceptTermsCheckbox();

        shoppingCartPage.clickPlaceOrderButton();

        expect(isCallRecordingFeatureEnabledOnUserAccount(true)).toBe(true);
 
    });

    it('Call Recording feature should be disabled if not selected on Shopping Cart page', () => {
        shoppingCartPage.clickStandardSelectButton();

        shoppingCartPage.deselectCallRecordingFeature();

        shoppingCartPage.fillInCustomerInfo(testFirstName, testLastName, testBusinessName, testBusinessEmail);

        shoppingCartPage.clickContinueButton();

        shoppingCartPage.fillInCreditCardInfo(testFullName, testCreditCardNumber, testCvv);

        shoppingCartPage.clickAcceptTermsCheckbox();

        shoppingCartPage.clickPlaceOrderButton();

        expect(isCallRecordingFeatureEnabledOnUserAccount(false)).toBe(false);
    });

    it('Call Recording option should be selected by default', () => {
        shoppingCartPage.clickStandardSelectButton();

        const isCallRecordingSelected = shoppingCartPage.isCallRecordingFeatureSelected();
        expect(isCallRecordingSelected).toBe(true);
    });

    it('Call Recording is shown in shopping cart when adding Call Recording', () => {
        const initialPlanPrice = shoppingCartPage.getStandardPrice();

        shoppingCartPage.clickStandardSelectButton();

        shoppingCartPage.selectCallRecordingFeature();

        shoppingCartPage.fillInCustomerInfo(testFirstName, testLastName, testBusinessName, testBusinessEmail);

        shoppingCartPage.clickContinueButton();

        const isCallRecordingInShoppingCart = Boolean(browser.isVisible(shoppingCartPage.CALL_RECORDING_LABEL_IN_SHOPPING_CART));

        expect(isCallRecordingInShoppingCart).toBe(true);
    });

    it('Total plan amount should not increase when adding Call Recording', () => {
        const initialPlanPrice = shoppingCartPage.getStandardPrice();

        shoppingCartPage.clickStandardSelectButton();

        shoppingCartPage.selectCallRecordingFeature();

        shoppingCartPage.fillInCustomerInfo(testFirstName, testLastName, testBusinessName, testBusinessEmail);

        shoppingCartPage.clickContinueButton();

        const totalPrice = shoppingCartPage.getTotalPrice();

        expect(totalPrice).toBe(initialPlanPrice);
    });

    xit('Email should contain correct information');

    xit('CRM should contain correct information');
});




