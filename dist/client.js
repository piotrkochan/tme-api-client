"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var httpBuildQuery = require("http-build-query");
var crypto = require("crypto");
var sortKeys = require("sort-keys");
var TmeApiClient = (function () {
    function TmeApiClient(token, secret, baseUrl, defaultLanguage, defaultCountry) {
        if (baseUrl === void 0) { baseUrl = 'https://api.tme.eu/'; }
        if (defaultLanguage === void 0) { defaultLanguage = 'EN'; }
        if (defaultCountry === void 0) { defaultCountry = 'GB'; }
        this.token = token;
        this.secret = secret;
        this.baseUrl = baseUrl;
        this.defaultLanguage = defaultLanguage;
        this.defaultCountry = defaultCountry;
        this.baseUrl = baseUrl.replace(/\/*$/, '') + '/';
        this.client = axios_1.default.create({ baseURL: baseUrl });
        this.client.interceptors.request.use(this.signRequestInterceptor.bind(this));
    }
    TmeApiClient.prototype.signRequestInterceptor = function (config) {
        // some defaults
        config.data = Object.assign({
            Language: this.defaultLanguage,
            Country: this.defaultCountry
        }, config.data);
        var authData = {
            Token: this.token,
            ApiSignature: this.calcSig(config.url, __assign({}, config.data, { Token: this.token }))
        };
        config.data = __assign({}, config.data, authData);
        return config;
    };
    // @see http://locutus.io/php/url/rawurlencode/
    TmeApiClient.prototype.rawurlencode = function (text) {
        text = (text + '');
        return encodeURIComponent(text)
            .replace(/!/g, '%21')
            .replace(/'/g, '%27')
            .replace(/\(/g, '%28')
            .replace(/\)/g, '%29')
            .replace(/\*/g, '%2A');
    };
    TmeApiClient.prototype.calcSig = function (url, data) {
        url = this.baseUrl + url;
        data = sortKeys(data, { deep: true });
        var qs = httpBuildQuery(data);
        var sigBase = 'POST&' + this.rawurlencode(url) + '&' + this.rawurlencode(qs);
        return crypto.createHmac('sha1', this.secret).update(sigBase, 'utf8').digest('base64');
    };
    TmeApiClient.prototype.request = function (resource, data, format) {
        if (format === void 0) { format = 'json'; }
        return this.client.post(resource.replace(/^\/+/g, '') + '.' + format, data);
    };
    return TmeApiClient;
}());
exports.TmeApiClient = TmeApiClient;
