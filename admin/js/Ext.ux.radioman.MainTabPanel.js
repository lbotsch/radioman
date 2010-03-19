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
			    	title: 'Dashboard',
			    	
			    	items: [
			    	    listenersChart
			    	]
			    },
			    {
			    	id: 'library-tab',
			    	title: 'Media Library',
			    	layout: 'border',
			    	items: [
			    	    new Ext.ux.radioman.LibraryManager({
			    	    	title: 'Library Manager',
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
			    }
			]
		});
		
		Ext.ux.radioman.MainTabPanel.superclass.initComponent.apply(this, arguments);
	}
});