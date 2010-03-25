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
					 title: _t('Navigation.Title'),
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
				        expanded: true,
				        children: [{
				            text: _t('Navigation.Items.Dashboard'),
				            leaf: true,
				            id: 'nav-index',
				            listeners: {
				        		click: function() {
				        			Ext.DomHelper.overwrite(
				        					Ext.DomQuery.selectNode('div#help-panel div.x-panel-body'),
				        					_t('Navigation.HelpPanel.Items.Dashboard'));
				        			Ext.getCmp('main-tab-panel').setActiveTab('index-tab');
				        		}
				        	}
				          }, {
				            text: _t('Navigation.Items.MediaLibrary'),
				            leaf: true,
				            id: 'nav-library',
				            listeners: {
				        		click: function() {
				        			Ext.DomHelper.overwrite(
				        					Ext.DomQuery.selectNode('div#help-panel div.x-panel-body'),
				        					_t('Navigation.HelpPanel.Items.MediaLibrary'));
				        			Ext.getCmp('main-tab-panel').setActiveTab('library-tab');
				        		}
				        	}
				          }],
				        rootVisible: true
				      }
				  }), {
					 	id: 'help-panel',
					    title: _t('Navigation.HelpPanel.Title'),
					    region: 'south',
					    height: 180,
					    bodyStyle: 'padding:4px;padding-bottom:15px;background:#eee;',
						autoScroll: true,
						html: _t('Navigation.HelpPanel.Items.Dashboard')
				  }
			]
		});
		
		Ext.ux.radioman.Navigation.superclass.initComponent.apply(this, arguments);
	}
});