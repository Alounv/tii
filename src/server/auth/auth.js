import { actionQrl, zodQrl, z, loaderQrl } from "@builder.io/qwik-city";
import {
  inlinedQrl,
  useLexicalScope,
  implicit$FirstArg,
} from "@builder.io/qwik";
import { Auth, skipCSRFCheck } from "@auth/core";
import { isServer } from "@builder.io/qwik/build";
var setCookieExports = {};
var setCookie = {
  get exports() {
    return setCookieExports;
  },
  set exports(v) {
    setCookieExports = v;
  },
};
var defaultParseOptions = {
  decodeValues: true,
  map: false,
  silent: false,
};
function isNonEmptyString(str) {
  return typeof str === "string" && !!str.trim();
}
function parseString(setCookieValue, options) {
  var parts = setCookieValue.split(";").filter(isNonEmptyString);
  var nameValuePairStr = parts.shift();
  var parsed = parseNameValuePair(nameValuePairStr);
  var name = parsed.name;
  var value = parsed.value;
  options = options
    ? Object.assign({}, defaultParseOptions, options)
    : defaultParseOptions;
  try {
    value = options.decodeValues ? decodeURIComponent(value) : value;
  } catch (e) {
    console.error(
      "set-cookie-parser encountered an error while decoding a cookie with value '" +
        value +
        "'. Set options.decodeValues to false to disable this feature.",
      e
    );
  }
  var cookie = {
    name,
    value,
  };
  parts.forEach(function (part) {
    var sides = part.split("=");
    var key = sides.shift().trimLeft().toLowerCase();
    var value2 = sides.join("=");
    if (key === "expires") {
      cookie.expires = new Date(value2);
    } else if (key === "max-age") {
      cookie.maxAge = parseInt(value2, 10);
    } else if (key === "secure") {
      cookie.secure = true;
    } else if (key === "httponly") {
      cookie.httpOnly = true;
    } else if (key === "samesite") {
      cookie.sameSite = value2;
    } else {
      cookie[key] = value2;
    }
  });
  return cookie;
}
function parseNameValuePair(nameValuePairStr) {
  var name = "";
  var value = "";
  var nameValueArr = nameValuePairStr.split("=");
  if (nameValueArr.length > 1) {
    name = nameValueArr.shift();
    value = nameValueArr.join("=");
  } else {
    value = nameValuePairStr;
  }
  return { name, value };
}
function parse(input, options) {
  options = options
    ? Object.assign({}, defaultParseOptions, options)
    : defaultParseOptions;
  if (!input) {
    if (!options.map) {
      return [];
    } else {
      return {};
    }
  }
  if (input.headers && input.headers["set-cookie"]) {
    input = input.headers["set-cookie"];
  } else if (input.headers) {
    var sch =
      input.headers[
        Object.keys(input.headers).find(function (key) {
          return key.toLowerCase() === "set-cookie";
        })
      ];
    if (!sch && input.headers.cookie && !options.silent) {
      console.warn(
        "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
      );
    }
    input = sch;
  }
  if (!Array.isArray(input)) {
    input = [input];
  }
  options = options
    ? Object.assign({}, defaultParseOptions, options)
    : defaultParseOptions;
  if (!options.map) {
    return input.filter(isNonEmptyString).map(function (str) {
      return parseString(str, options);
    });
  } else {
    var cookies = {};
    return input.filter(isNonEmptyString).reduce(function (cookies2, str) {
      var cookie = parseString(str, options);
      cookies2[cookie.name] = cookie;
      return cookies2;
    }, cookies);
  }
}
function splitCookiesString(cookiesString) {
  if (Array.isArray(cookiesString)) {
    return cookiesString;
  }
  if (typeof cookiesString !== "string") {
    return [];
  }
  var cookiesStrings = [];
  var pos = 0;
  var start;
  var ch;
  var lastComma;
  var nextStart;
  var cookiesSeparatorFound;
  function skipWhitespace() {
    while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
      pos += 1;
    }
    return pos < cookiesString.length;
  }
  function notSpecialChar() {
    ch = cookiesString.charAt(pos);
    return ch !== "=" && ch !== ";" && ch !== ",";
  }
  while (pos < cookiesString.length) {
    start = pos;
    cookiesSeparatorFound = false;
    while (skipWhitespace()) {
      ch = cookiesString.charAt(pos);
      if (ch === ",") {
        lastComma = pos;
        pos += 1;
        skipWhitespace();
        nextStart = pos;
        while (pos < cookiesString.length && notSpecialChar()) {
          pos += 1;
        }
        if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
          cookiesSeparatorFound = true;
          pos = nextStart;
          cookiesStrings.push(cookiesString.substring(start, lastComma));
          start = pos;
        } else {
          pos = lastComma + 1;
        }
      } else {
        pos += 1;
      }
    }
    if (!cookiesSeparatorFound || pos >= cookiesString.length) {
      cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
    }
  }
  return cookiesStrings;
}
setCookie.exports = parse;
setCookieExports.parse = parse;
var parseString_1 = (setCookieExports.parseString = parseString);
var splitCookiesString_1 = (setCookieExports.splitCookiesString =
  splitCookiesString);
const actions = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
];
async function authAction(body, req, path, authOptions) {
  const request = new Request(new URL(path, req.request.url), {
    method: req.request.method,
    headers: req.request.headers,
    body,
  });
  request.headers.set("content-type", "application/x-www-form-urlencoded");
  const res = await Auth(request, {
    ...authOptions,
    skipCSRFCheck,
  });
  res.headers.forEach((value, key) => {
    req.headers.set(key, value);
  });
  fixCookies(req);
  try {
    return await res.json();
  } catch (error) {
    return await res.text();
  }
}
const fixCookies = (req) => {
  req.headers.set("set-cookie", req.headers.get("set-cookie") || "");
  const cookie = req.headers.get("set-cookie");
  if (cookie) {
    req.headers.delete("set-cookie");
    splitCookiesString_1(cookie).forEach((cookie2) => {
      const { name, value, ...rest } = parseString_1(cookie2);
      req.cookie.set(name, value, rest);
    });
  }
};
const getCurrentPageForAction = (req) => req.url.href.split("q-")[0];
function serverAuthQrl(authOptions) {
  const useAuthSignin = actionQrl(
    /* @__PURE__ */ inlinedQrl(
      async ({ providerId, callbackUrl, ...rest }, req) => {
        const [authOptions2] = useLexicalScope();
        callbackUrl ?? (callbackUrl = getCurrentPageForAction(req));
        const auth = await authOptions2(req);
        const body = new URLSearchParams({
          callbackUrl,
        });
        Object.entries(rest).forEach(([key, value]) => {
          body.set(key, String(value));
        });
        const pathname =
          "/api/auth/signin" + (providerId ? `/${providerId}` : "");
        const data = await authAction(body, req, pathname, auth);
        if (data.url) throw req.redirect(301, data.url);
      },
      "serverAuthQrl_useAuthSignin_action_z9lQXM0Y81E",
      [authOptions]
    ),
    zodQrl(
      /* @__PURE__ */ inlinedQrl(
        {
          providerId: z.string().optional(),
          callbackUrl: z.string().optional(),
        },
        "serverAuthQrl_useAuthSignin_action_zod_dGRn68KpbpU"
      )
    )
  );
  const useAuthSignout = actionQrl(
    /* @__PURE__ */ inlinedQrl(
      async ({ callbackUrl }, req) => {
        const [authOptions2] = useLexicalScope();
        callbackUrl ?? (callbackUrl = getCurrentPageForAction(req));
        const auth = await authOptions2(req);
        const body = new URLSearchParams({
          callbackUrl,
        });
        await authAction(body, req, `/api/auth/signout`, auth);
      },
      "serverAuthQrl_useAuthSignout_action_VBhsB2rX4fg",
      [authOptions]
    ),
    zodQrl(
      /* @__PURE__ */ inlinedQrl(
        {
          callbackUrl: z.string().optional(),
        },
        "serverAuthQrl_useAuthSignout_action_zod_adv6i0Nlqos"
      )
    )
  );
  const useAuthSession = loaderQrl(
    /* @__PURE__ */ inlinedQrl((req) => {
      return req.sharedMap.get("session");
    }, "serverAuthQrl_useAuthSession_loader_8VTTI8cC6rw")
  );
  const onRequest = async (req) => {
    if (isServer) {
      const action = req.url.pathname.slice(10).split("/")[0];
      const auth = await authOptions(req);
      if (
        actions.includes(action) &&
        req.url.pathname.startsWith("/api/auth/")
      ) {
        const res = await Auth(req.request, auth);
        const cookie = res.headers.get("set-cookie");
        if (cookie) {
          req.headers.set("set-cookie", cookie);
          res.headers.delete("set-cookie");
          fixCookies(req);
        }
        throw req.send(res);
      } else
        req.sharedMap.set("session", await getSessionData(req.request, auth));
    }
  };
  return {
    useAuthSignin,
    useAuthSignout,
    useAuthSession,
    onRequest,
  };
}
const serverAuth$ = /* @__PURE__ */ implicit$FirstArg(serverAuthQrl);
const ensureAuthMiddleware = (req) => {
  const isLoggedIn = req.sharedMap.has("session");
  if (!isLoggedIn) throw req.error(403, "sfs");
};
async function getSessionData(req, options) {
  options.secret ?? (options.secret = process.env.AUTH_SECRET);
  options.trustHost ?? (options.trustHost = true);
  const url = new URL("/api/auth/session", req.url);
  const response = await Auth(
    new Request(url, {
      headers: req.headers,
    }),
    options
  );
  const { status = 200 } = response;
  const data = await response.json();
  if (!data || !Object.keys(data).length) return null;
  if (status === 200) return data;
  throw new Error(data.message);
}
export {
  authAction,
  ensureAuthMiddleware,
  fixCookies,
  getCurrentPageForAction,
  getSessionData,
  serverAuth$,
  serverAuthQrl,
};
