Ext.namespace('Ext.ux.radioman.i18n');

Ext.ux.radioman.i18n.Translator = Ext.extend(Object, {
	_lang: 'en',
	getLang: function() { return this._lang; },
	setLang: function(lang) {
		if(typeof lang != 'string') {
			console.error('[I18N] setLang(',lang,'): argument error');
			return;
		}
		this._lang = lang;
	},
	/**
	 * Get a translated string by key
	 * @param key string
	 * @return string
	 */
	translate: function(key) {
		if(arguments.length < 1) return;
		var v = Ext.ux.radioman.i18n[this._lang];
		if(!v) {
			console.warn("[I18N] Language '"+this._lang+"' is not implemented.");
			return "";
		}
		var k = key.split(".");
		var s = k.shift();
		while(typeof s != 'undefined') {
			v = v[s];
			if(!v) {
				console.warn("[I18N] The key '"+key+"' has no translation to language '"+this._lang+"'.");
				return "";
			}
			s = k.shift();
		}
		if (arguments.length > 1) {
			v = String.format(v, Array.prototype.slice.apply(arguments, [1]));
		}
		return v;
	}
});

Ext.ux.radioman.i18n.Translator = new Ext.ux.radioman.i18n.Translator();

function _t() {
	return Ext.ux.radioman.i18n.Translator.translate.apply(Ext.ux.radioman.i18n.Translator, arguments);
}