/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern!tdd',
  'intern/chai!assert',
  'tests/addons/environment'
], function (tdd, assert, Environment) {

  with (tdd) {
    suite('headerLanguage', function () {
      var accountHelper;
      var respond;
      var client;
      var mail;
      var RequestMocks;

      beforeEach(function () {
        var env = new Environment();
        accountHelper = env.accountHelper;
        respond = env.respond;
        RequestMocks = env.RequestMocks;
        client = env.client;
        mail = env.mail;
      });

      test('#signUp', function () {
        var user = "test" + Date.now();
        var email = user + "@restmail.net";
        var password = "iliketurtles";
        var opts = {
          lang: 'it-ch;'
        };

        return respond(client.signUp(email, password, opts), RequestMocks.signUp)
          .then(function (res) {
            assert.ok(res.uid);
            return respond(mail.wait(user), RequestMocks.mailSignUpLang);
          })
          .then(
            function (emails) {
              assert.property(emails[0], 'headers');
              assert.equal(emails[0].headers['content-language'], 'it-ch');
            },
            assert.notOk
          );
      });

      test('#passwordForgotSendCode', function () {
        var account;
        var passwordForgotToken;
        var opts = {
          lang: 'it-CH;',
          service: 'sync'
        };

        return accountHelper.newUnverifiedAccount()
          .then(function (acc) {
            account = acc;

            return respond(client.passwordForgotSendCode(account.input.email, opts), RequestMocks.passwordForgotSendCode)
          })
          .then(function (result) {
            passwordForgotToken = result.passwordForgotToken;
            assert.ok(passwordForgotToken, "passwordForgotToken is returned");

            return respond(mail.wait(account.input.user, 2), RequestMocks.resetMailLang);
          })
          .then(
            function (emails) {
              assert.property(emails[1], 'headers');
              assert.equal(emails[1].headers['content-language'], 'it-ch');
            },
            assert.notOk
          )
      });

      test('#recoveryEmailResendCode', function () {
        var user;
        var opts = {
          lang: 'it-CH;'
        };

        return accountHelper.newUnverifiedAccount()
          .then(function (account) {
            user = account.input.user;

            return respond(client.recoveryEmailResendCode(account.signIn.sessionToken, opts), RequestMocks.recoveryEmailResendCode)
          })
          .then(
          function(res) {
            assert.ok(res);

            return respond(mail.wait(user, 2), RequestMocks.resetMailLang);
          })
          .then(
            function (emails) {
              assert.property(emails[1], 'headers');
              assert.equal(emails[1].headers['content-language'], 'it-ch');
            },
            assert.notOk
          )
      });

    });
  }
});
