import Ember from 'ember';
import layout from './template';

const {observer, on, isNone} = Ember;

export default Ember.Component.extend({
  layout,
  loading: false,
  ready: false,
  error: false,
  value: null,

  _promiseLoading() {
    this.setProperties({
      loading: true,
      ready: false,
      error: false
    });

    this.sendAction('on-loading');
  },

  _promiseDone(value) {
    this.setProperties({
      value,
      loading: false,
      ready: true
    });

    this.sendAction('on-done', value);
  },

  _promiseError(error) {
    this.setProperties({
      loading: false,
      ready: false,
      error
    });

    this.sendAction('on-error', error);
  },

  async _waitForPromise(promise) {
    if (this.get('loading')) return;

    this._promiseLoading();

    try {
      const value = await promise;

      this._promiseDone(value);
    }
    catch (error) {
      Ember.Logger.error(error);
      this._promiseError(error.message);
    }
  },

  _startWaitingOnRenderOrChange: on('didInsertElement', observer('promise', function() {
    const promise = this.get('promise');

    if (!isNone(promise)) {
      const safePromise = Promise.resolve(promise);

      this._waitForPromise(safePromise);
    }
  }))
}).reopenClass({
  positionalParams: ['promise']
});
