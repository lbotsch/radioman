// Main application file

Ext.onReady(function() {
  var body = Ext.getBody();

  Ext.QuickTips.init();

  new Ext.Viewport({
		layout: 'border',
		title: 'Radio Admin',
		items: [
		    {
				xtype: 'box',
				region: 'north',
				applyTo: 'header',
				height: 30
			},
			new Ext.ux.radioman.Navigation({
				id: 'navigation',
		    	title: '',
		    	region:'west'
			}),
			new Ext.ux.radioman.MainTabPanel({
				id: 'main-tab-panel',
				region: 'center'
			})
		],
		renderTo: body
  });
});
