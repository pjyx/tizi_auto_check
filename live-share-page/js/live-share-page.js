(function () {
    'use strict';

    var APP_STORE_URL = 'https://apps.apple.com/cn/app/anar%E4%BA%91tv/id6476186566';
    var ANDROID_DOWNLOAD_URL =
        'https://a.app.qq.com/o/simple.jsp?pkgname=com.bestv.ott.baseservices.mp.xjdx_xjmp';

    var shareParams = {};

    /**
     * 将井号转义，避免 URL 解析异常（与点播分享页保持一致）
     */
    function preprocessUrl() {
        return window.location.href.replace(/#/g, '%23');
    }

    /**
     * Base64 解码并按 UTF-8 还原（直播 payload 含中文/维语）
     */
    function decodeBase64Utf8(encoded) {
        var binary = atob(encoded);
        var bytes = new Uint8Array(binary.length);
        for (var i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder('utf-8').decode(bytes);
    }

    function decodePayload(encoded) {
        if (!encoded) {
            return null;
        }
        try {
            // 兼容 URL-safe Base64
            var normalized = encoded.replace(/-/g, '+').replace(/_/g, '/');
            while (normalized.length % 4 !== 0) {
                normalized += '=';
            }
            return JSON.parse(decodeBase64Utf8(normalized));
        } catch (e) {
            console.error('直播分享参数解码失败:', e);
            return null;
        }
    }

    /**
     * 解析分享参数，优先使用 p（Base64 JSON），并兼容明文 query
     */
    function parseParams() {
        var url;
        try {
            url = new URL(preprocessUrl());
        } catch (e) {
            console.error('URL 解析失败:', e);
            return {};
        }

        var params = {};
        var decoded = decodePayload(url.searchParams.get('p'));
        if (decoded) {
            Object.keys(decoded).forEach(function (key) {
                if (decoded[key] !== null && decoded[key] !== undefined) {
                    params[key] = String(decoded[key]);
                }
            });
        }

        ['channelCode', 'name', 'name2', 'poster', 'endTime'].forEach(function (key) {
            var value = url.searchParams.get(key);
            if (!params[key] && value) {
                params[key] = value;
            }
        });
        return params;
    }

    function render(params) {
        var title = params.name || '精彩直播';
        var titleUyghur = params.name2 || '';
        var poster = params.poster || '';

        document.title = title;
        document.getElementById('title').textContent = title;
        document.getElementById('titleUyghur').textContent = titleUyghur;

        var posterEl = document.getElementById('poster');
        var placeholderEl = document.getElementById('posterPlaceholder');
        if (poster) {
            posterEl.src = poster;
            posterEl.hidden = false;
            placeholderEl.style.display = 'none';
            posterEl.onerror = function () {
                posterEl.style.display = 'none';
                placeholderEl.style.display = 'block';
            };
        }
    }

    function buildScheme() {
        var query = new URLSearchParams();
        if (shareParams.channelCode) {
            query.set('channelCode', shareParams.channelCode);
        }
        if (shareParams.name) {
            query.set('name', shareParams.name);
        }
        if (shareParams.name2) {
            query.set('name2', shareParams.name2);
        }
        if (shareParams.poster) {
            query.set('poster', shareParams.poster);
        }
        if (shareParams.endTime) {
            query.set('endTime', shareParams.endTime);
        }
        return 'anar://live?' + query.toString();
    }

    function isIOS() {
        var ua = navigator.userAgent || navigator.vendor || window.opera;
        return /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
    }

    function isWechatOrQQ() {
        var ua = (navigator.userAgent || '').toLowerCase();
        return ua.indexOf('micromessenger') > -1 || ua.indexOf('qq/') > -1;
    }

    function openAndroidApp() {
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = buildScheme();
        document.body.appendChild(iframe);

        setTimeout(function () {
            if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
            }
            window.location.href = ANDROID_DOWNLOAD_URL;
        }, 2000);
    }

    function handleCtaClick(event) {
        if (isWechatOrQQ()) {
            event.preventDefault();
            document.getElementById('wechatOverlay').hidden = false;
            return;
        }

        if (isIOS()) {
            window.location.href = APP_STORE_URL;
            return;
        }

        event.preventDefault();
        openAndroidApp();
    }

    function bindEvents() {
        document.getElementById('cta').addEventListener('click', handleCtaClick);
        var overlay = document.getElementById('wechatOverlay');
        overlay.addEventListener('click', function () {
            overlay.hidden = true;
        });
    }

    function init() {
        shareParams = parseParams();
        console.log('直播分享参数:', shareParams);
        render(shareParams);
        bindEvents();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
