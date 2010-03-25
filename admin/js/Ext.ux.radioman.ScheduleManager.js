Ext.namespace('Ext.ux.radioman');

Ext.ux.radioman.JsonScheduleWriter = Ext.extend(Ext.data.JsonWriter, {
	createRecord: function(rec) {
		var hash = Ext.ux.radioman.JsonScheduleWriter.superclass.createRecord.apply(this, arguments);
		hash.startdate = hash.startdate.format("Y-m-d");
		hash.enddate = hash.enddate.format("Y-m-d");
		return hash;
	},
	updateRecord: function(rec) {
		var hash = Ext.ux.radioman.JsonScheduleWriter.superclass.updateRecord.apply(this, arguments);
		hash.startdate = hash.startdate.format("Y-m-d");
		hash.enddate = hash.enddate.format("Y-m-d");
		return hash;
	}
});

Ext.ux.radioman.ScheduleManager = Ext.extend(Ext.grid.GridPanel, {
	
	autoExpandColumn: 'playlist',
	
	initComponent: function() {
		this.rowEditor = new Ext.ux.grid.RowEditor({
 			saveText: _t('ScheduleManager.Editor.Save'),
 			cancelText: _t('ScheduleManager.Editor.Cancel'),
 			commitChangesText: _t('ScheduleManager.Editor.CommitChanges'),
 			errorText: _t('Common.Error')
		});

		
		this.playlistColumnEditor = new Ext.form.ComboBox({
			autoLoad: true,
			displayField: 'name',
			lazyRender: false,
			listeners: {
				// delete the previous query in the beforequery event or set
				// combo.lastQuery = null (this will reload the store the next time it expands)
			    beforequery: function(qe){
			        delete qe.combo.lastQuery;
			    }
			},
			store: new Ext.data.Store({
				baseParams: {cmd: 'loadPlaylists'},
				reader: new Ext.data.JsonReader({
					idProperty: 'playlist_id',
					fields: [
						'playlist_id',
						'name'
					]
				}),
				url: 'playlist-mgr.php'
			}),
			triggerAction: 'all',
			typeAhead: true,
			valueField: 'playlist_id',
			valueNotFoudText: _t('ScheduleManager.PlaylistCol.ValueNotFoundText')
		});
		
		this.channelColumnEditor = new Ext.form.ComboBox({
			autoLoad: true,
			displayField: 'name',
			lazyRender: false,
			listeners: {
				// delete the previous query in the beforequery event or set
				// combo.lastQuery = null (this will reload the store the next time it expands)
			    beforequery: function(qe){
			        delete qe.combo.lastQuery;
			    }
			},
			store: new Ext.data.Store({
				baseParams: {cmd: 'load'},
				reader: new Ext.data.JsonReader({
					idProperty: 'name',
				    root: 'channels',
				    totalProperty: 'results',
				    messageProperty: 'message',
				    successProperty: 'success',
					fields: [
						'name'
					]
				}),
				url: 'channel-mgr.php'
			}),
			triggerAction: 'all',
			typeAhead: true,
			valueField: 'name',
			valueNotFoudText: _t('ScheduleManager.ChannelCol.ValueNotFoundText')
		});
		
		this.playlistColumnRenderer = function(value,m,rec) {
			this.playlistColumnEditor.getStore().reload();
			var record = this.playlistColumnEditor.findRecord(this.playlistColumnEditor.valueField, value);
			return record ?
				record.get(this.playlistColumnEditor.displayField)
				: rec.data.playlist_name;
		};
		
		var addScheduleBtn = new Ext.Button({
			text: _t('ScheduleManager.ToolBar.Add')
		});
		addScheduleBtn.on('click', this.handleAddSchedule, this);
		
		var removeScheduleBtn = new Ext.Button({
			text: _t('ScheduleManager.ToolBar.Remove')
		});
		removeScheduleBtn.on('click', this.handleRemoveSchedule, this);
		
		Ext.apply(this, {
			colModel: new Ext.grid.ColumnModel({
				columns: [
					{
						header: _t('ScheduleManager.ChannelCol.Header'),
						dataIndex: 'channel',
						editor: this.channelColumnEditor
					},
					{
						id: 'playlist',
						header: _t('ScheduleManager.PlaylistCol.Header'),
						dataIndex: 'playlist_id',
						renderer: {fn: this.playlistColumnRenderer, scope: this},
						editor: this.playlistColumnEditor
					},
					{header: _t('ScheduleManager.StartDateCol.Header'), dataIndex: 'startdate', editor: new Ext.form.DateField({format: 'd/m/Y'}), renderer: function(value) {return value ? value.format('d/m/Y') : '';}},
					{header: _t('ScheduleManager.StartTimeCol.Header'), dataIndex: 'starttime', editor: new Ext.form.TimeField({format: 'H:i', increment: 30})},
					{header: _t('ScheduleManager.EndDateCol.Header'), dataIndex: 'enddate', editor: new Ext.form.DateField({format: 'd/m/Y'}), renderer: function(value) {return value ? value.format('d/m/Y') : '';}},
					{header: _t('ScheduleManager.EndTimeCol.Header'), dataIndex: 'endtime', editor: new Ext.form.TimeField({format: 'H:i', increment: 30})},
					{
						xtype: 'booleancolumn',
			            header: _t('ScheduleManager.EnabledCol.Header'),
			            dataIndex: 'enabled',
			            width: 50,
			            trueText: _t('Common.Yes'),
			            falseText: _t('Common.No'),
			            editor: {
			                xtype: 'checkbox'
			            }
					},
					{header: _t('ScheduleManager.PriorityCol.Header'), dataIndex: 'priority', width: 80, editor: new Ext.form.NumberField({allowBlank: false, allowDecimals: false, value: 1})}
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
						read: 'schedule-mgr.php?cmd=load',
						create: 'schedule-mgr.php?cmd=create',
						update: 'schedule-mgr.php?cmd=update',
						destroy: 'schedule-mgr.php?cmd=destroy'
					}
				}),
				reader: new Ext.data.JsonReader({
					idProperty: 'id',
				    root: 'schedules',
				    totalProperty: 'results',
				    messageProperty: 'message',
				    successProperty: 'success',
				    fields: [
				    	{name: 'channel'},
				    	{name: 'playlist_id'},
				    	{name: 'playlist_name'},
				    	{name: 'startdate', type: 'date', dateFormat: 'Y-m-d'},
				    	{name: 'starttime'},
				    	{name: 'enddate', type: 'date', dateFormat: 'Y-m-d'},
				    	{name: 'endtime'},
				    	{name: 'enabled'},
				    	{name: 'priority'}
				    ]
				}),
				writer: new Ext.ux.radioman.JsonScheduleWriter({
				//writer: new Ext.data.JsonWriter({
					writeAllFields: true
				})
			}),
			tbar: {
				items: [
					addScheduleBtn,
					'-',
					removeScheduleBtn
				]
			}
		}); 
		
		Ext.ux.radioman.ScheduleManager.superclass.initComponent.apply(this, arguments);
	},
	handleAddSchedule: function() {
		var Schedule = this.getStore().recordType;
		var e = new Schedule({
            playlist_id: null,
            startdate: (new Date()).clearTime(),
            starttime: '12:00',
            enddate: (new Date()).clearTime(),
            endtime: '00:00',
            enabled: true
        });
        this.rowEditor.stopEditing();
        this.getStore().insert(0, e);
        this.getView().refresh();
        this.getSelectionModel().selectRow(0);
        this.rowEditor.startEditing(0);

	},
	handleRemoveSchedule: function() {
		Ext.Msg.confirm(_t('ScheduleManager.ToolBar.DeleteMsgTitle'),
    			_t('ScheduleManager.ToolBar.DeleteMsgBody'), function(btn) {
    		if(btn == "yes") {
    			var r = this.getSelectionModel().getSelections();
    			this.getStore().remove(r);
    		}
    	}, this);
	}
});