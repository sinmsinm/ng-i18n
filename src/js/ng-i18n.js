'use strict';

angular.module('ngI18nConfig', []).value('ngI18nConfig', {});
angular.module('ngI18n', ['ngI18nService', 'ngI18nConfig'])
    .value('ngI18nVersion', '<%= pkg.version %>');

angular.module('ngI18nService', [],function ($provide) {

    $provide.factory('ngI18nResourceBundle', ['$http', 'ngI18nConfig', '$window',
        function ($http, ngI18nConfig, $window) {
            ngI18nConfig.basePath = ngI18nConfig.basePath || 'i18n';
            ngI18nConfig.supportedLocales = ngI18nConfig.supportedLocales || [];

            function get(options) {
                //noinspection JSDuplicatedDeclaration
                var options = options || {};
                var resourceBundleName = options.name || 'resourceBundle';
                var url = '/' + ngI18nConfig.basePath + '/' + resourceBundleName + getSuffix(options) + '.json';
                return $http.get(url);
            }

            function getSuffix(options) {
                var locale = getLocale(options);
                if(isDefaultLocale(locale)){
                    return '';
                }
                if (isLocaleSupported(locale)) {
                    return '_' + locale;
                }
                var language = getLanguageFromLocale(locale);
                return isLocaleSupported(language) ? '_' + language :  '';
            }

            function isDefaultLocale(locale) {
                return locale === ngI18nConfig.defaultLocale;
            }

            function getLanguageFromLocale(locale) {
                return locale.split('-')[0];
            }

            function isLocaleSupported(locale) {
                return indexOf(ngI18nConfig.supportedLocales, locale) != -1;
            }

            function indexOf(array, obj) {
                if (array.indexOf) return array.indexOf(obj);

                for (var i = 0; i < array.length; i++) {
                    if (obj === array[i]) return i;
                }
                return -1;
            }

            function getLocale(options) {
                return options.locale || getLanguageFromNavigator();
            }

            function getLanguageFromNavigator() {
                return $window.navigator.userLanguage || $window.navigator.language;
            }

            return { get:get};
        }]);

}).value('name', 'ngI18nService');
