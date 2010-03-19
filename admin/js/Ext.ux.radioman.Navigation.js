Ext.namespace('Ext.ux.radioman');

Ext.ux.radioman.Navigation = Ext.extend(Ext.Panel, {
	layout: 'border',
	border: false,
    collapsible: true,
    animFloat: false,
    autoHide: false,
    split:true,
	margins: '2 0 5 5',
    width: 275,
    minSize: 100,
    maxSize: 500,
    initComponent: function() {
		Ext.apply(this, {
			items: [
				{
				    id: 'ra-player-panel',
				    title: 'Play Live Radio',
				    region: 'north',
				    autoScroll: true,
				    html: '<p>[PLAYER]</p>'
				 },
				 new Ext.tree.TreePanel({
					 id: 'ra-nav-tree-panel',
					 title: 'Navigation',
				     region:'center',
				     split: true,
				      height: 300,
				      minSize: 150,
				      autoScroll: true,
				      
				      // tree-specific configs:
				      rootVisible: false,
				      lines: false,
				      singleExpand: true,
				      useArrows: true,
				      
				      root: {
				        text: 'Navigation',
				        expanded: true,
				        children: [{
				            text: 'Index',
				            leaf: true,
				            id: 'nav-index',
				            listeners: {
				        		click: function() {
				        			Ext.DomHelper.overwrite(
				        					Ext.DomQuery.selectNode('div#help-panel div.x-panel-body'),
				        					'<h2>Index</h2><p class="details-info">Shows server statistics</p>');
				        			Ext.getCmp('main-tab-panel').setActiveTab('index-tab');
				        		}
				        	}
				          }, {
				            text: 'Media Library',
				            leaf: true,
				            id: 'nav-library',
				            listeners: {
				        		click: function() {
				        			Ext.DomHelper.overwrite(
				        					Ext.DomQuery.selectNode('div#help-panel div.x-panel-body'),
				        					'<h2>Media Library</h2><p class="details-info">Upload your music files, edit metatags and manage your library.</p>');
				        			Ext.getCmp('main-tab-panel').setActiveTab('library-tab');
				        		}
				        	}
				          }],
				        rootVisible: true
				      }
				  }), {
					 	id: 'help-panel',
					    title: 'Help',
					    region: 'south',
					    height: 180,
					    bodyStyle: 'padding:4px;padding-bottom:15px;background:#eee;',
						autoScroll: true,
						html: '<p class="details-info">When you select an item from the menu, additional details will display here.</p>'
				  }
			]
		});
		
		Ext.ux.radioman.Navigation.superclass.initComponent.apply(this, arguments);
	}
});