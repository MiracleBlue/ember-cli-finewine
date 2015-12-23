/* jshint expr:true */
import {expect} from 'chai';
import {
  describeComponent,
  it
} from 'ember-mocha';
import hbs from 'htmlbars-inline-precompile';

describeComponent(
  'await-block',
  'Integration: AwaitBlockComponent',
  {
    integration: true
  },
  function() {
    it('renders', function() {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });
      // Template block usage:
      // this.render(hbs`
      //   {{#await-block}}
      //     template content
      //   {{/await-block}}
      // `);

      this.render(hbs`{{await-block}}`);
      expect(this.$()).to.have.length(1);
    });

    it('should fire a loading action and display a loading template when the promise is unresolved', function() {
      const promise = new Promise((resolve, reject) => {
        // should never resolve
      });

      let loadingCalled = false;

      const loading = () => {
        loadingCalled = true;
      };

      this.setProperties({
        promise,
        loading
      });

      this.render(hbs`
        {{#await-block promise on-loading=(action loading) as |value|}}
          {{value}}
        {{else}}
          <div class='loading'>Loading...</div>
        {{/await-block}}
      `);

      expect(this.$('.loading')).to.have.length(1);
      expect(loadingCalled).to.be.true;
    });
  }
);
