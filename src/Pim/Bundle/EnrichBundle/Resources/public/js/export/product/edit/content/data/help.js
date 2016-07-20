/**
 * Extension to add a help tooltip on filters.
 *
 * @author    Yohan Blain <yohan.blain@akeneo.com>
 * @copyright 2016 Akeneo SAS (http://www.akeneo.com)
 * @license   http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 */
'use strict';

define([
    'jquery',
    'underscore',
    'oro/translator',
    'pim/form',
    'text!pim/template/export/product/edit/content/data/help'

], function ($, _, __, BaseForm, template) {
    return BaseForm.extend({
        template: _.template(template),

        /**
         * {@inherit}
         */
        configure: function () {
            this.listenTo(this.getRoot(), 'pim_enrich:form:filter:extension:add', this.addFilterExtension.bind(this));

            return BaseForm.prototype.configure.apply(this, arguments);
        },

        /**
         * Adds the extension to filters.
         *
         * @param {Object} event
         */
        addFilterExtension: function (event) {
            var $content = $(this.template({
                text: __('pim_enrich.export.product.filter.' + event.filter.shortname + '.help')
            }));

            $content.find('[data-toggle="tooltip"]').tooltip();

            event.filter.addElement(
                'after-input',
                'help',
                $content
            );
        }
    });
});