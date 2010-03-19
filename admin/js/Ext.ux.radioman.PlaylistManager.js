Ext.namespace('Ext.ux.radioman');

Ext.ux.radioman.PlaylistGridPanel = Ext.extend(Ext.grid.EditorGridPanel, {
	
	autoExpandColumn: 'name',
	clicksToEdit: 2,
	store: null,
	initComponent: function() {
		var addPlaylistButton = new Ext.Button({
			text: 'Add Playlist'
		});
		addPlaylistButton.on('click', this.handleAddPlaylist, this);
		
		var removePlaylistButton = new Ext.Button({
			text: 'Remove Playlist'
		});
		removePlaylistButton.on('click', this.handleRemovePlaylist, this);
		
		var editPlaylistButton = new Ext.Button({
			text: 'Edit Playlist'
		});
		editPlaylistButton.on('click', this.handleEditPlaylist, this);
		
		// {{{
		Ext.apply(this, {
			selModel: new Ext.grid.RowSelectionModel({
				singleSelect: true
		    }),
			store: new Ext.data.Store({
				url: 'playlist-mgr.php',
				baseParams: {cmd: 'loadPlaylists'},
				autoLoad: true,
				autoDestroy: true,
				reader: new Ext.data.JsonReader({
					fields: [
					    {name: 'playlist_id'},
					    {name: 'name'},
					    {name: 'songs'}
					]
				}),
				sortInfo: {field:'name', direction:'ASC'}
			}),
			columns: [
				{
			        id:'name',
			        header: 'Name',
			        width: 360,
			        sortable: true,
			        dataIndex: 'name',
			        editor: new Ext.form.TextField({
			          allowBlank: false
			        })
			    }, {
			        header: 'Songs',
			        width: 75,
			        sortable: true,
			        dataIndex: 'songs'
			    }
	        ],
			tbar: new Ext.Toolbar({
				items: [
				    addPlaylistButton,
				    '-', 
				    removePlaylistButton,
				    '-',
			        editPlaylistButton
				]
			})
		});
		
		// call parent
		Ext.ux.radioman.PlaylistGridPanel.superclass.initComponent.apply(this, arguments);
		
		// register event handlers
		this.on({
			afteredit: {scope:this, fn:this.onAfterEdit}
		});
		
		this.addEvents(
			/**
			 * @event editplaylist
			 * Fires when a playlist is selected for editing.
			 * @param {Ext.data.Record} the playlist record
			 */
			'editplaylist'
		);
	},
	
	onAfterEdit: function(e) {
		Ext.Ajax.request({
			url: 'playlist-mgr.php',
			method: 'POST',
			grid: e.grid,
			record: e.record,
			newValue: e.value,
			oldValue: e.originalValue,
			params: {cmd: 'editPlaylist', id: e.record.data.playlist_id, name: e.value},
			success: function(response, o) {
				var resp = Ext.decode(response.responseText);
				o.record.store.reload();
				if(resp.status != "success") {
					Ext.Msg.alert('Error', 'An error occurred while trying to edit the playlist name.');
				}
			},
			failure: function(r, o) {
				o.record.store.reload();
				Ext.Msg.alert('Error', 'An error occurred while trying to edit the playlist name.');
			},
			scope: this
		});
		return false; // We wait for the server to answer
	},
	
	handleAddPlaylist: function(sender, e) {
		// access the Record constructor through the grid's store
		Ext.Ajax.request({
			url: 'playlist-mgr.php',
			method: 'POST',
			params: {cmd: 'createPlaylist', name: 'New Playlist'},
			success: function(response) {
				var resp = Ext.decode(response.responseText);
				if(resp.status == "success") {
				
					var Playlist = this.getStore().recordType;
			        var p = new Playlist({
			            name: 'New Playlist',
			            songs: 0
			        });
			        this.stopEditing();
			        this.getStore().insert(0, p);
			        this.startEditing(0, 0);
				} else {
					Ext.Msg.alert('Error', 'An error occurred while trying to create the playlist.');
				}
			},
			failure: function() {
				Ext.Msg.alert('Error', 'An error occurred while trying to create the playlist.');
			},
			scope: this
		});
	},
	
	handleRemovePlaylist: function() {
		var selection = this.getSelectionModel().getSelected();
		if(!selection) return false;
        Ext.Msg.confirm('Delete playlist?', 'Do you really want to delete playlist "'+selection.data.name+'"?', function(btn){
          if(btn == "yes") {
        	  Ext.Ajax.request({
      			url: 'playlist-mgr.php',
      			method: 'POST',
      			params: {cmd: 'removePlaylist', id: selection.data.playlist_id},
      			success: function(response) {
      				var resp = Ext.decode(response.responseText);
      				if(resp.status == "success") {
	      				this.stopEditing();
	      				this.getStore().remove(selection);
      				} else {
      					Ext.Msg.alert('Error', 'An error occurred while trying to delete the playlist.');
      				}
      			},
      			failure: function() {
      				Ext.Msg.alert('Error', 'An error occurred while trying to delete the playlist.');
      			},
      			scope: this
        	  });
          }
        }, this);
	},
	
	handleEditPlaylist: function() {
		var selection = this.getSelectionModel().getSelected();
		if(!selection) return false;
        this.fireEvent('editplaylist', selection);
	}
});

Ext.ux.radioman.PlaylistEditor = Ext.extend(Ext.grid.GridPanel, {
	ddGroup: 'LibraryDD',
	//enableDragDrop: true,
	plugins: [new Ext.ux.dd.GridDragDropRowOrder(
		    {
		    	scrollable: true,
		    	targetCfg: {}
		    })],
	stripeRows: true,
	autoExpandColumn: 'title',
	initComponent: function() {
		var removeItemButton = new Ext.Button({
			text: 'Remove'
		});
		var savePlaylistButton = new Ext.Button({
			text: 'Save Playlist'
		});
		
		removeItemButton.on('click', this.handleRemoveItem, this);
		savePlaylistButton.on('click', this.handleSavePlaylist, this);
	
		Ext.apply(this, {
			store: new Ext.data.Store({
				url: 'playlist-mgr.php',
				baseParams: {cmd: 'loadPlaylistData'},
				autoDestroy: true,
				reader: new Ext.data.JsonReader({
					fields: [
					    {name: 'path'},
					    {name: 'title'},
					    {name: 'artist'},
					    {name: 'playtime'}
					]
				})
			}),
			selModel: new Ext.grid.RowSelectionModel({
				singleSelect: false
		    }),
			columns: [
	            {
	            	id: 'title',
	            	header: 'Title',
	            	dataIndex: 'title',
	            	sortable: false
	            }, {
	            	header: 'Artist',
	            	dataIndex: 'artist',
	            	sortable: false
	            }, {
	            	header: 'Playtime',
	            	dataIndex: 'playtime',
	            	sortable: false
	            }, {
	            	header: 'Path',
	            	dataIndex: 'path',
	            	width: 220,
	            	sortable: false,
	            	hidden: true
	            }
		    ],
		    bbar: new Ext.Toolbar({
		    	items: [
				    removeItemButton,
				    '->',
			        savePlaylistButton
				]
			})
		});
		Ext.ux.radioman.PlaylistEditor.superclass.initComponent.apply(this, arguments);
		
		this.addEvents(
			/**
			 * @arg Ext.data.Record playlist
			 * @arg int songs_count
			 */
			'playlistsaved'
		);
	},
	edit: function(playlist) {
		// Load playlist data
		this.playlist = playlist.data;
		this.playlist.record = playlist;
		this.getStore().load({
			params: {id: this.playlist.playlist_id}
		});
		
		//Ext.Msg.alert('Status', 'Editing playlist '+playlist.data.name+'.');
	},
	handleRemoveItem: function() {
		var selection = this.getSelectionModel().getSelected();
		Ext.Msg.confirm('Delete item?', 'Do you really want to delete the item "'+selection.data.title+'"?', function(btn){
			if(btn == "yes") {
				this.getStore().remove(selection);
			}
        }, this);
	},
	handleSavePlaylist: function() {
		var pl = [];
		var st = this.getStore();
		for(var i = 0; i < st.getCount(); i++) {
			var item = st.getAt(i).data;
			pl[i] = {path: item.path, title: item.title, artist: item.artist, playtime: item.playtime};
		}
		pl = Ext.util.JSON.encode({items: pl});
		
		Ext.Ajax.request({
			url: 'playlist-mgr.php',
			method: 'POST',
			playlist: this.playlist.record,
			songs: st.getCount(),
			params: {cmd: 'updatePlaylistData', id: this.playlist.playlist_id, data: pl},
			success: function(response, o) {
				var resp = Ext.decode(response.responseText);
				if(resp.status == "success") {
					this.playlist.record.data.songs = o.songs;
					this.playlist = null;
					this.getStore().removeAll(true);
					
					this.expand(false);
					this.fireEvent('playlistsaved', o.playlist, o.songs);
				} else {
					Ext.Msg.alert('Error', 'An error occurred while trying to save the playlist.');
				}
			},
			failure: function() {
				Ext.Msg.alert('Error', 'An error occurred while trying to save the playlist.');
			},
			scope: this
		});
		Ext.Msg.alert('Status', 'Saving playlist '+this.playlist.name+'.'+pl);
	}
});

Ext.ux.radioman.PlaylistManager = Ext.extend(Ext.Panel, {
	layout: 'accordion',
	
	initComponent: function() {
		var playlistGridPanel = new Ext.ux.radioman.PlaylistGridPanel({
        	title: 'Playlists',
        	id: 'playlist-grid-panel',
        	border: false,
	      	split: true,
	        animFloat: false,
	        autoHide: false,
	      	height: 300,
	        minSize: 200,
	        maxSize: 400
        });
		
		var playlistEditor = new Ext.ux.radioman.PlaylistEditor({
        	title: 'Playlist Editor',
        	id: 'playlist-editor-panel'
        });
		
		playlistGridPanel.on('editplaylist', function(pl) {
			playlistEditor.expand(true);
			playlistEditor.edit(pl);
		}, playlistEditor);
		
		Ext.apply(this, {
			items: [
			    playlistGridPanel,
			    playlistEditor
			]
		});
		
		// call parent
		Ext.ux.radioman.PlaylistManager.superclass.initComponent.apply(this, arguments);
	}
});