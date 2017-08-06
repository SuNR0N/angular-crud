import { binding, given, then } from 'cucumber-tsflow';
import { AngularCrudPage } from '../pages/app.po';
import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';

use(chaiAsPromised);

@binding()
class AppSteps {
    private angularCrudPage = new AngularCrudPage();

    @given(/^I am on the home page$/)
    public givenIAmOnTheHomePage() {
        return this.angularCrudPage.navigateTo();
    }

    @then(/^I should see the title of the application$/)
    public thenIShouldSeeTheTitle() {
        return expect(this.angularCrudPage.header.getText()).to.eventually.equal('Angular CRUD');
    }
}

export = AppSteps;
