Ext.namespace('Ext.ux.radioman');

Ext.ux.radioman.MainTabPanel = Ext.extend(Ext.TabPanel, {
	margins: '2 5 5 0',
	activeTab: 0,
	border: false,
	initComponent: function() {
		Ext.apply(this, {
			items: [
			    {
			    	id: 'index-tab',
			    	title: _t('Navigation.Items.Dashboard'),
			    	
			    	items: [
			    	    listenersChart
			    	]
			    },
			    new Ext.ux.radioman.ChannelManager({
			    	id: 'channel-manager',
			    	title: _t('ChannelManager.Title')
			    }),
			    {
			    	id: 'library-tab',
			    	title: _t('Navigation.Items.MediaLibrary'),
			    	layout: 'border',
			    	items: [
			    	    new Ext.ux.radioman.LibraryManager({
			    	    	title: _t('LibraryManager.Title'),
			    	    	id: 'library-manager',
			    	    	region:'west',
			    	    	split: true,
			    	    	animFloat: false,
			    	    	autoHide: false,
			    	    	autoScroll:true,
			    	    	width: 300,
			    	    	minSize: 200,
			    	    	maxSize: 500
			    	    })
			    	    ,new Ext.ux.radioman.PlaylistManager({
			    	    	id: 'playlist-manager',
			    	    	region: 'center'
			    	    })
			    	]
			    },
			    new Ext.ux.radioman.ScheduleManager({
			    	id: 'schedule-manager',
			    	title: _t('ScheduleManager.Title')
			    })
			]
		});
		
		Ext.ux.radioman.MainTabPanel.superclass.initComponent.apply(this, arguments);
	}
});