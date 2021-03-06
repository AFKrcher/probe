import { Meteor } from "meteor/meteor";

export const helmetOptions = (forExpress) => {
  const self = "'self'";
  const data = "data:";
  const unsafeEval = "'unsafe-eval'";
  const unsafeInline = "'unsafe-inline'";
  const allowedOrigins = Meteor.settings.allowedOrigins;

  const url = Meteor.absoluteUrl();
  const domain = url.replace(/http(s)*:\/\//, "").replace(/\/$/, "");
  const s = url.match(/(?!=http)s(?=:\/\/)/) ? "s" : "";
  const connectSrc = [self, `http${s}://${domain}`, `ws${s}://${domain}`];
  const usesHttps = s.length > 0;

  const srcOpts = forExpress ? [self] : [self, unsafeEval];

  const options = {
    contentSecurityPolicy: {
      blockAllMixedContent: true,
      directives: {
        defaultSrc: srcOpts,
        scriptSrc: [self],
        childSrc: srcOpts,
        connectSrc: connectSrc.concat(allowedOrigins),
        fontSrc: [self, data, unsafeInline],
        formAction: srcOpts,
        frameAncestors: [self],
        frameSrc: ["*"],
        imgSrc: ["*"],
        manifestSrc: srcOpts,
        mediaSrc: srcOpts,
        objectSrc: srcOpts,
        sandbox: ["allow-forms", "allow-modals", "allow-same-origin", "allow-scripts", "allow-popups", "allow-downloads"],
        styleSrc: [self, unsafeInline],
        workerSrc: [self, "blob:"]
      }
    },
    strictTransportSecurity: {
      maxAge: 15552000,
      includeSubDomains: true,
      preload: false
    },
    referrerPolicy: {
      policy: "no-referrer"
    },
    expectCt: {
      enforce: true,
      maxAge: 604800
    },
    frameguard: {
      action: "sameorigin"
    },
    dnsPrefetchControl: {
      allow: false
    },
    permittedCrossDomainPolicies: {
      permittedPolicies: "none"
    }
  };

  if (!usesHttps && Meteor.isDevelopment && !forExpress) {
    delete options.contentSecurityPolicy.directives.blockAllMixedContent;
    options.contentSecurityPolicy.directives.scriptSrc = [self, unsafeEval, unsafeInline];
  }
  return options;
};
