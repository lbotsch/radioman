Ext.namespace('Ext.ux.radioman.i18n');

/**
 * 
 */
Ext.ux.radioman.i18n.fr = {
	Common: {
		Yes: 'Oui',
		No: 'Non',
		Error: 'Erreur'
	},
	Navigation: {
		Title: 'Navigation',
		Items: {
			Dashboard: 'Tableau de bord',
			MediaLibrary: 'Collection'
		},
		HelpPanel: {
			Title: 'Aide',
			Items: {
				Dashboard: '<h2>Tableau de bord</h2><p class="details-info">Accès rapide aux informations et fonctions les plus importantes.</p>',
				MediaLibrary: '<h2>Collection</h2><p class="details-info">Organisez votre collection de musique, ajoutez des morceaux et créez des playlist.</p>'
			}
		}
	},
	LibraryManager: {
		Title: 'Organiser la collection',
		Root: 'Collection',
		FileManager: {
			Uploader: {
				JsonError: 'Impossible de lire la réponse du serveur',
				UnknownError: 'Erreur inconnue'
			},
			UploadPanel: {
				Add: 'Ajouter',
				ClickRemove: 'Cliquer pour supprimer',
				ClickStop: 'Cliquer pour arrêter l\'envoi',
				Empty: 'Pas de fichiers',
				Error: 'Erreur',
				FileQueued: 'Le fichier <b>{0}</b> est prêt pour l\'envoi',
				FileDone: 'Le fichier <b>{0}</b> a été envoyé',
				FileFailed: 'Le fichier <b>{0}</b> n\'a pu être envoyé',
				FileStopped: 'Le fichier <b>{0}</b> a été annulé par l\'utilisateur',
				FileUploading: 'Envoi en cours <b>{0}</b>',
				RemoveAll: 'Tout supprimer',
				Remove: 'Supprimer',
				StopAll: 'Arrêter tous les envois',
				Upload: 'Envoyer'
			},
			Menu: {
				Collapse: 'Tout réduire',
				DeleteKey: 'Touche supprimer',
				Delete: 'Supprimer',
				Expand: 'Tout étendre',
				Newdir: 'Nouveau dossier',
				OpenBlank: 'Ouvrir dans une nouvelle fenêtre',
				OpenDownload: 'Télécharger',
				OpenPopup: 'Ouvrir dans une fenêtre',
				OpenSelf: 'Ouvrir dans cette fenêtre',
				Open: 'Ouvrir',
				Reload: 'Actualiser',
				Rename: 'Renommer',
				UploadFile: 'Envoyer un fichier',
				Upload: 'Envoyer'
			},
			Confirm: 'Confirmer',
			Delete: 'Supprimer',
			Error: 'Erreur',
			Exists: 'Le fichier <b>{0}</b> existe déjà',
			File: 'Fichier',
			Newdir: 'Nouveau dossier',
			Overwrite: 'Etes-vous sûr de vouloir remplacer le fichier ?',
			ReallyWant: 'Est-ce que vous voulez vraiment ',
			Root: 'Dossier racine'
		}
	},
	PlaylistManager: {
		PlaylistGrid: {
			Title: 'Playlists',
			Add: 'Ajouter',
			Remove: 'Supprimer',
			Edit: 'Modifier cette Playlist',
			EditError: 'Le nom de la playlist n\'a pas pu être modifié.',
			NewPlaylistName: 'Nouvelle playlist',
			CreateError: 'La création d\'une nouvelle playlist a échoué.',
			DeleteMsgTitle: 'Vraiment supprimer?',
			DeleteMsgBody: 'Etes-vous sûr de vouloir supprimer la playlist "{0}"?',
			DeleteError: 'La playlist n\'a pas pu être supprimée.',
			NameCol: 'Nom',
			SongsCol: 'Morceaux'
		},
		PlaylistEditor: {
			Title: 'Editeur de playlist',
			Remove: 'Effacer la sélection',
			Save: 'Sauvegarder la playlist',
			TitleCol: 'Titre',
			ArtistCol: 'Artiste',
			AlbumCol: 'Album',
			PlaytimeCol: 'Durée',
			PathCol: 'Chemin',
			DeleteMsgTitle: 'Vraiment effacer?',
			DeleteMsgBody: 'Voulez-vous vraiment effacer la sélection suivante?',
			NoSelectionError: 'Vous n\'avez pas sélectionné de playlist. Selectionnez-en une et clickez sur \'Modifier cette Playlist\'',
			SaveError: 'La playlist n\'a pas pu être sauvegardée à cause d\'une erreur.'
		}
	},
	ScheduleManager: {
		Title: 'Programmation',
		Editor: {
			Save: 'Sauvegarder',
			Cancel: 'Abandonner',
			CommitChanges: 'Vous devez sauvegarder.'
		},
		ToolBar: {
			Add: 'Ajouter',
			Remove: 'Supprimer',
			DeleteMsgTitle: 'Vraiment supprimer?',
			DeleteMsgBody: 'Etes-vous sûr de vouloir supprimer le programme sélectionné?'
		},
		ChannelCol: {
			Header: 'Station',
			ValueNotFoundText: 'Station inconnue'
		},
		PlaylistCol: {
			Header: 'Playlist',
			ValueNotFoundText: 'Playlist inconnue'
		},
		StartDateCol: {
			Header: 'Date de lancement'
		},
		StartTimeCol: {
			Header: 'Heure de lancement'
		},
		EndDateCol: {
			Header: 'Date d\'expiration'
		},
		EndTimeCol: {
			Header: 'Heure d\'expiration'
		},
		EnabledCol: {
			Header: 'Activé?'
		},
		PriorityCol: {
			Header: 'Priorité'
		}
	},
	ChannelManager: {
		Title: 'Stations Radio',
		Editor: {
			Save: 'Sauvegarder',
			Cancel: 'Abandonner',
			CommitChanges: 'Vous devez sauvegarder.'
		},
		NewChannel: {
			Name: 'Nouvelle station',
			Mount: 'nouveau',
			Genre: 'inconnu',
			Description: 'Modifiez cette description'
		},
		ToolBar: {
			Add: 'Ajouter',
			Remove: 'Supprimer',
			DeleteMsgTitle: 'Vraiment supprimer?',
			DeleteMsgBody: 'Etes-vous sûr de vouloir supprimer la station sélectionnée?'
		},
		NameCol: {
			Header: 'Nom'
		},
		MountCol: {
			Header: 'Nœud'
		},
		GenreCol: {
			Header: 'Genre'
		},
		DescriptionCol: {
			Header: 'Description'
		}
	}
};

Ext.ux.radioman.i18n.Translator.setLang('fr');