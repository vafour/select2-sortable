/**
 * jQuery Select2 Sortable
 * - enable select2 to be sortable via normal select element
 * 
 * author      : Vafour
 * inspired by : jQuery Chosen Sortable (https://github.com/mrhenry/jquery-chosen-sortable)
 * License     : GPL
 */

(function($){
	$.fn.extend({
		select2SortableOrder: function(){
			var $this      = this.filter('[multiple]').first(),
			    $select2   = $this.siblings('.select2-container'),
			    unselected = [],
			    sorted;

			$this.find('option').each(function(){
				!this.selected && unselected.push(this);
			});

			sorted = $($select2.find('.select2-choices li[class!="select2-search-field"]').map( function() {
				if (!this) {
					return undefined;
				}
				var text = $.trim($(this).text());
				return $this.find('option').filter(function () { return $(this).html() == text; })[0];
			}));

			sorted.push.apply(sorted, unselected);

			$this.children().remove();
			$this.append(sorted);
			$this.select2sortableDestroy();
			$this.select2Sortable();

			return $this;
		},
		select2Sortable: function(){
			var args         = Array.prototype.slice.call(arguments, 0);
			    $this        = this.filter('[multiple]'),
			    validMethods = ['destroy'];

			if(args.length === 0 || typeof(args[0]) === 'object')
			{
				var defaultSortableOptions = {
					'placeholder' : 'ui-state-highlight',
					'items'       : 'li:not(.select2-search-field)',
					'tolerance'   : 'pointer'
				};

				var sortableOptions = $.extend(defaultSortableOptions, args[0]);

				$this.select2();

				$this.each(function(){
					var $select  = $(this);
					var $select2 = $select.siblings('.select2-container');

					// Init jQuery UI Sortable
					$select2.find('.select2-choices').sortable(sortableOptions);

					// Apply options ordering in form submit
					$select.closest('form').unbind('submit.select2sortable').on('submit.select2sortable', function(){
						$select.select2SortableOrder();
					});
				});
			}
			else if(typeof(args[0] === 'string'))
			{
				if($.inArray(args[0], validMethods) == -1)
				{
					throw "Unknown method: " + args[0];
				}
				if(args[0] === 'destroy')
				{
					$this.select2sortableDestroy();
				}
			}
			return $this;
		},
		select2sortableDestroy: function(){
			var $this = this.filter('[multiple]');
			$this.each(function(){
				var $select  = $(this);

				// apply options ordering and unbind form submit event
				$select.closest('form').unbind('submit.select2sortable');

				// destroy select2
				$this.select2('destroy');
			});
			return $this;
		}
	});
}(jQuery));