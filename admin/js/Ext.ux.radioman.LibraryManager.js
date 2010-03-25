Ext.namespace('Ext.ux.radioman');

// Localisation
// {{{

Ext.apply(Ext.ux.FileUploader.prototype, {
    jsonErrorText:_t('LibraryManager.FileManager.Uploader.JsonError'),
    unknownErrorText:_t('LibraryManager.FileManager.Uploader.UnknownError')
});
Ext.apply(Ext.ux.UploadPanel.prototype, {
    addText:_t('LibraryManager.FileManager.UploadPanel.Add'),
    clickRemoveText:_t('LibraryManager.FileManager.UploadPanel.ClickRemove'),
    clickStopText:_t('LibraryManager.FileManager.UploadPanel.ClickStop'),
    emptyText:_t('LibraryManager.FileManager.UploadPanel.Empty'),
    errorText:_t('LibraryManager.FileManager.UploadPanel.Error'),
    fileQueuedText:_t('LibraryManager.FileManager.UploadPanel.FileQueued'),
    fileDoneText:_t('LibraryManager.FileManager.UploadPanel.FileDone'),
    fileFailedText:_t('LibraryManager.FileManager.UploadPanel.FileFailed'),
    fileStoppedText:_t('LibraryManager.FileManager.UploadPanel.FileStopped'),
    fileUploadingText:_t('LibraryManager.FileManager.UploadPanel.FileUploading'),
    removeAllText:_t('LibraryManager.FileManager.UploadPanel.RemoveAll'),
    removeText:_t('LibraryManager.FileManager.UploadPanel.Remove'),
    stopAllText:_t('LibraryManager.FileManager.UploadPanel.StopAll'),
    uploadText:_t('LibraryManager.FileManager.UploadPanel.Upload')
});
Ext.apply(Ext.ux.FileTreeMenu.prototype, {
	collapseText:_t('LibraryManager.FileManager.Menu.Collapse'),
	deleteKeyName:_t('LibraryManager.FileManager.Menu.DeleteKey'),
	deleteText:_t('LibraryManager.FileManager.Menu.Delete'),
	expandText:_t('LibraryManager.FileManager.Menu.Expand'),
	newdirText:_t('LibraryManager.FileManager.Menu.Newdir'),
	openBlankText:_t('LibraryManager.FileManager.Menu.OpenBlank'),
	openDwnldText:_t('LibraryManager.FileManager.Menu.OpenDownload'),
	openPopupText:_t('LibraryManager.FileManager.Menu.OpenPopup'),
	openSelfText:_t('LibraryManager.FileManager.Menu.OpenSelf'),
	openText:_t('LibraryManager.FileManager.Menu.Open'),
	reloadText:_t('LibraryManager.FileManager.Menu.Reload'),
	renameText:_t('LibraryManager.FileManager.Menu.Rename'),
	uploadFileText:_t('LibraryManager.FileManager.Menu.UploadFile'),
	uploadText:_t('LibraryManager.FileManager.Menu.Upload')
});
Ext.apply(Ext.ux.FileTreePanel.prototype, {
    confirmText:_t('LibraryManager.FileManager.Confirm'),
    deleteText:_t('LibraryManager.FileManager.Delete'),
    errorText:_t('LibraryManager.FileManager.Error'),
    existsText:_t('LibraryManager.FileManager.Exists'),
    fileText:_t('LibraryManager.FileManager.File'),
    newdirText:_t('LibraryManager.FileManager.Newdir'),
    overwriteText:_t('LibraryManager.FileManager.Overwrite'),
    reallyWantText:_t('LibraryManager.FileManager.ReallyWant'),
    rootText:_t('LibraryManager.FileManager.Root')
});
// }}}


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
	,rootText:_t('LibraryManager.Root')
		
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