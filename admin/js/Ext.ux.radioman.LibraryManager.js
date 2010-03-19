Ext.namespace('Ext.ux.radioman');

Ext.ux.radioman.LibraryManager = Ext.extend(Ext.ux.FileTreePanel, {
	// config variables overridable from outside
	// {{{
	/**
	 * @cfg {String} ddGroup
	 */
	ddGroup: 'LibraryDD'
	
	/**
	 * @cfg {Number} maxFileSize Maximum upload file size in bytes
	 * This config property is propagated down to uploader for convenience
	 */
	,maxFileSize: 209715200 // 200Mb
	
	/**
	 * @cfg {String} openMode Default file open mode. This mode is used when user dblclicks 
	 * a file. Other valid values are '_self', '_blank' and 'download' (defaults to 'download')
	 */
	,openMode: 'download'
	
	/**
	 * @cfg {String} rootPath Relative path pointing to the directory that is root of this tree (defaults to 'library')
	 */
	,rootPath:'library'
	
	/**
	 * @cfg {String} rootText Text to display for root node (defaults to 'Library')
	 */
	,rootText:'Library'
		
	/**
	 * @cfg {Boolean} topMenu true to create top toolbar with menu in addition to contextmenu (defaults to true)
	 */
	,topMenu:true
	
	/**
	 * @cfg {String} url URL to use when communicating with server
	 */
	,url:'library-mgr.php'
	// }}}
	
	// overrides
	// {{{
	/**
	 * called by Ext when instantiating
	 * @private
	 * @param {Object} config Configuration object
	 */
	,initComponent:function() {
		
		
		// call parent
		Ext.ux.radioman.LibraryManager.superclass.initComponent.apply(this, arguments);
	} // eo function initComponent
	// }}}
});