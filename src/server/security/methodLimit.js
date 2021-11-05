import { DDPRateLimiter } from "meteor/ddp-rate-limiter";
import { _ } from "meteor/underscore";

DDPRateLimiter.setErrorMessage(({ timeToReset }) => {
  const time = Math.ceil(timeToReset / 1000);
  const seconds = time === 1 ? "second" : "seconds";
  return `You have reached your request limit for this action. Please try again in ${time} ${seconds}.`;
});

const assignLimits = ({ methods, limit, timeRange }) => {
  DDPRateLimiter.addRule(
    {
      type: "method",
      name(name) {
        return _.contains(methods, name);
      }
    },
    limit,
    timeRange
  );
};

export const methodRateLimit = (options) => assignLimits(options);
