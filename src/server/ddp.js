import { Meteor } from "meteor/meteor";
import { DDPRateLimiter } from "meteor/ddp-rate-limiter";
import { _ } from "meteor/underscore";

DDPRateLimiter.setErrorMessage(({ timeToReset }) => {
  const time = Math.ceil(timeToReset / 1000);
  const seconds = time === 1 ? "second" : "seconds";
  return `Easy on the gas, buddy. Too many requests. Try again in ${time} ${seconds}.`;
});

const assignLimits = ({ methods, limit, timeRange }) => {
  DDPRateLimiter.addRule(
    {
      type: "method",
      name(name) {
        return _.contains(methods, name);
      },
    },
    limit,
    timeRange
  );
};

export const rateLimit = (options) => assignLimits(options);
