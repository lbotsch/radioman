Ext.namespace('Ext.ux.radioman.i18n');

/**
 * 
 */
Ext.ux.radioman.i18n.en = {
	Common: {
		Yes: 'Yes',
		No: 'No',
		Error: 'Error'
	},
	Navigation: {
		Title: 'Navigation',
		Items: {
			Dashboard: 'Dashboard',
			MediaLibrary: 'Library'
		},
		HelpPanel: {
			Title: 'Help',
			Items: {
				Dashboard: '<h2>Index</h2><p class="details-info">Shows server statistics</p>',
				MediaLibrary: '<h2>Media Library</h2><p class="details-info">Upload your music files, edit metatags and manage your library.</p>'
			}
		}
	},
	LibraryManager: {
		Title: 'Library Manager',
		Root: 'Library',
		FileManager: {
			Uploader: {
				JsonError: 'Cannot decode JSON object',
				UnknownError: 'Unknown error'
			},
			UploadPanel: {
				Add: 'Add',
				ClickRemove: 'Click to remove',
				ClickStop: 'Click to stop',
				Empty: 'No files',
				Error: 'Error',
				FileQueued: 'File <b>{0}</b> is queued for upload',
				FileDone: 'File <b>{0}</b> has been successfully uploaded',
				FileFailed: 'File <b>{0}</b> failed to upload',
				FileStopped: 'File <b>{0}</b> stopped by user',
				FileUploading: 'Uploading file <b>{0}</b>',
				RemoveAll: 'Remove All',
				Remove: 'Remove',
				StopAll: 'Stop All',
				Upload: 'Upload'
			},
			Menu: {
				Collapse: 'Collapse all',
				DeleteKey: 'Delete Key',
				Delete: 'Delete',
				Expand: 'Expand all',
				Newdir: 'New folder',
				OpenBlank: 'Open in new window',
				OpenDownload: 'Download',
				OpenPopup: 'Open in popup',
				OpenSelf: 'Open in this window',
				Open: 'Open',
				Reload: 'R<span style="text-decoration:underline">e</span>load',
				Rename: 'Rename',
				UploadFile: '<span style="text-decoration:underline">U</span>pload file',
				Upload: 'Upload'
			},
			Confirm: 'Confirm',
			Delete: 'Delete',
			Error: 'Error',
			Exists: 'File <b>{0}</b> already exists',
			File: 'File',
			Newdir: 'New folder',
			Overwrite: 'Do you want to overwrite it?',
			ReallyWant: 'Do you really want to',
			Root: 'Tree root'
		}
	},
	PlaylistManager: {
		PlaylistGrid: {
			Title: 'Playlists',
			Add: 'Add Playlist',
			Remove: 'Remove Playlist',
			Edit: 'Edit Playlist',
			EditError: 'An error occurred while trying to edit the playlist name.',
			NewPlaylistName: 'New Playlist',
			CreateError: 'An error occurred while trying to create the playlist.',
			DeleteMsgTitle: 'Delete playlist?',
			DeleteMsgBody: 'Do you really want to delete the playlist "{0}"?',
			DeleteError: 'An error occurred while trying to delete the playlist.',
			NameCol: 'Name',
			SongsCol: 'Songs'
		},
		PlaylistEditor: {
			Title: 'Playlist Editor',
			Remove: 'Remove',
			Save: 'Save Playlist',
			TitleCol: 'Title',
			ArtistCol: 'Artist',
			AlbumCol: 'Album',
			PlaytimeCol: 'Playtime',
			PathCol: 'Path',
			DeleteMsgTitle: 'Delete item?',
			DeleteMsgBody: 'Do you really want to delete the following items?',
			NoSelectionError: 'There is no playlist selected. Select a playlist and click on \'Edit Playlist\'',
			SaveError: 'An error occurred while trying to save the playlist.'
		}
	},
	ScheduleManager: {
		Title: 'Schedule Manager',
		Editor: {
			Save: 'Update',
			Cancel: 'Cancel',
			CommitChanges: 'You have to save or cancel your changes.'
		},
		ToolBar: {
			Add: 'Add',
			Remove: 'Remove',
			DeleteMsgTitle: 'Really remove?',
			DeleteMsgBody: 'Do you really want to remove the selected schedule?'
		},
		ChannelCol: {
			Header: 'Channel',
			ValueNotFoundText: 'Invalid channel'
		},
		PlaylistCol: {
			Header: 'Playlist',
			ValueNotFoundText: 'Invalid playlist'
		},
		StartDateCol: {
			Header: 'Start Date'
		},
		StartTimeCol: {
			Header: 'Start Time'
		},
		EndDateCol: {
			Header: 'End Date'
		},
		EndTimeCol: {
			Header: 'End Time'
		},
		EnabledCol: {
			Header: 'Active?'
		},
		PriorityCol: {
			Header: 'Priority'
		}
	},
	ChannelManager: {
		Title: 'Channel Manager',
		Editor: {
			Save: 'Update',
			Cancel: 'Cancel',
			CommitChanges: 'You have to save or cancel your changes.'
		},
		NewChannel: {
			Name: 'New Channel',
			Mount: 'new',
			Genre: 'unknown',
			Description: 'Change this description'
		},
		ToolBar: {
			Add: 'Add',
			Remove: 'Remove',
			DeleteMsgTitle: 'Really remove?',
			DeleteMsgBody: 'Do you really want to remove the selected channel?'
		},
		NameCol: {
			Header: 'Name'
		},
		MountCol: {
			Header: 'Mount Point'
		},
		GenreCol: {
			Header: 'Genre'
		},
		DescriptionCol: {
			Header: 'Description'
		}
	}
};

Ext.ux.radioman.i18n.Translator.setLang('en');