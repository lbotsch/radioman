Ext.namespace('Ext.ux.radioman');

Ext.ux.radioman.ChannelManager = Ext.extend(Ext.grid.GridPanel, {
	
	autoExpandColumn: 'description',
	
	initComponent: function() {
		this.rowEditor = new Ext.ux.grid.RowEditor({
 			saveText: _t('ChannelManager.Editor.Save'),
 			cancelText: _t('ChannelManager.Editor.Cancel'),
 			commitChangesText: _t('ChannelManager.Editor.CommitChanges'),
 			errorText: _t('Common.Error')
		});

		
		var addChannelBtn = new Ext.Button({
			text: _t('ChannelManager.ToolBar.Add')
		});
		addChannelBtn.on('click', this.handleAddChannel, this);
		
		var removeChannelBtn = new Ext.Button({
			text: _t('ChannelManager.ToolBar.Remove')
		});
		removeChannelBtn.on('click', this.handleRemoveChannel, this);
		
		Ext.apply(this, {
			colModel: new Ext.grid.ColumnModel({
				columns: [
					{id: 'name', header: _t('ChannelManager.NameCol.Header'), dataIndex: 'name', editor: new Ext.form.TextField()},
					{header: _t('ChannelManager.MountCol.Header'), dataIndex: 'mount', editor: new Ext.form.TextField()},
					{header: _t('ChannelManager.GenreCol.Header'), dataIndex: 'genre', editor: new Ext.form.TextField()},
					{id: 'description', header: _t('ChannelManager.DescriptionCol.Header'), dataIndex: 'description', editor: new Ext.form.TextField()}
				],
				defaults: {
					sortable: true,
					menuDisabled: true,
					hideable: false,
					editable: true,
					width: 150
				}
			}),
			plugins: [this.rowEditor],
			selModel: new Ext.grid.RowSelectionModel(),
			store: new Ext.data.Store({
				autoDestroy: true,
				autoLoad: true,
				autoSave: true,
				proxy: new Ext.data.HttpProxy({
					api: {
						read: 'channel-mgr.php?cmd=load',
						create: 'channel-mgr.php?cmd=create',
						update: 'channel-mgr.php?cmd=update',
						destroy: 'channel-mgr.php?cmd=destroy'
					}
				}),
				reader: new Ext.data.JsonReader({
					idProperty: 'name',
				    root: 'channels',
				    totalProperty: 'results',
				    messageProperty: 'message',
				    successProperty: 'success',
				    fields: [
				    	{name: 'name'},
				    	{name: 'mount'},
				    	{name: 'genre'},
				    	{name: 'description'}
				    ]
				}),
				writer: new Ext.data.JsonWriter({
					writeAllFields: true
				})
			}),
			tbar: {
				items: [
					addChannelBtn,
					'-',
					removeChannelBtn
				]
			}
		}); 
		
		Ext.ux.radioman.ChannelManager.superclass.initComponent.apply(this, arguments);
	},
	handleAddChannel: function() {
		var Channel = this.getStore().recordType;
		var e = new Channel({
            name: _t('ChannelManager.NewChannel.Name'),
            mount: _t('ChannelManager.NewChannel.Mount'),
            genre: _t('ChannelManager.NewChannel.Genre'),
            description: _t('ChannelManager.NewChannel.Description')
        });
        this.rowEditor.stopEditing();
        this.getStore().insert(0, e);
        this.getView().refresh();
        this.getSelectionModel().selectRow(0);
        this.rowEditor.startEditing(0);

	},
	handleRemoveChannel: function() {
		Ext.Msg.confirm(_t('ChannelManager.ToolBar.DeleteMsgTitle'),
    			_t('ChannelManager.ToolBar.DeleteMsgBody'), function(btn) {
    		if(btn == "yes") {
    			var r = this.getSelectionModel().getSelections();
    			this.getStore().remove(r);
    		}
    	}, this);
	}
});