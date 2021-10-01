import { Meteor } from "meteor/meteor";
import { WebApp } from "meteor/webapp";
import { Autoupdate } from "meteor/autoupdate";
import crypto from "crypto";
import helmet from "helmet";

export const helmetOptions = () => {
  const self = "'self'";
  const data = "data:";
  const unsafeEval = "'unsafe-eval'";
  const unsafeInline = "'unsafe-inline'";
  const allowedOrigins = Meteor.settings.allowedOrigins;

  const url = Meteor.absoluteUrl();
  const domain = url.replace(/http(s)*:\/\//, "").replace(/\/$/, "");
  const s = url.match(/(?!=http)s(?=:\/\/)/) ? "s" : "";
  const usesHttps = s.length > 0;
  const connectSrc = [self, `http${s}://${domain}`, `ws${s}://${domain}`];

  const options = {
    contentSecurityPolicy: {
      blockAllMixedContent: true,
      directives: {
        defaultSrc: [self, unsafeInline],
        scriptSrc: ["*"],
        childSrc: [self, unsafeInline],
        connectSrc: connectSrc.concat(allowedOrigins),
        fontSrc: [self, data, unsafeInline],
        formAction: [self],
        frameAncestors: [self],
        frameSrc: ["*"],
        imgSrc: ["*"],
        manifestSrc: [self, unsafeInline],
        mediaSrc: [self, unsafeInline],
        objectSrc: [self, unsafeInline],
        sandbox: [
          "allow-forms",
          "allow-modals",
          "allow-same-origin",
          "allow-scripts",
          "allow-popups",
        ],
        styleSrc: [self, unsafeInline],
        workerSrc: [self, "blob:"],
      },
    },
    strictTransportSecurity: {
      maxAge: 15552000,
      includeSubDomains: true,
      preload: false,
    },
    referrerPolicy: {
      policy: "no-referrer",
    },
    expectCt: {
      enforce: true,
      maxAge: 604800,
    },
    frameguard: {
      action: "sameorigin",
    },
    dnsPrefetchControl: {
      allow: false,
    },
    permittedCrossDomainPolicies: {
      permittedPolicies: "none",
    },
  };

  if (!usesHttps && Meteor.isDevelopment) {
    delete options.contentSecurityPolicy.directives.blockAllMixedContent;
    options.contentSecurityPolicy.directives.scriptSrc = [
      self,
      unsafeEval,
      unsafeInline,
    ];
  }

  return options;
};
