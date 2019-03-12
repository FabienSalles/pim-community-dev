'use strict';

/**
 * Create extension for the Datagrid View Selector.
 * It displays a button near the selector to allow the user to create a new view.
 *
 * @author    Adrien Pétremann <adrien.petremann@akeneo.com>
 * @copyright 2016 Akeneo SAS (http://www.akeneo.com)
 * @license   http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 */
define(
    [
        'jquery',
        'underscore',
        'oro/translator',
        'backbone',
        'pim/form',
        'pim/template/grid/view-selector/create-view',
        'pim/template/form/creation/modal',
        'pim/template/grid/view-selector/create-view-label-input',
        'pim/datagrid/state',
        'pim/saver/datagrid-view',
        'oro/messenger'
    ],
    function (
        $,
        _,
        __,
        Backbone,
        BaseForm,
        template,
        templateModal,
        templateInput,
        DatagridState,
        DatagridViewSaver,
        messenger
    ) {
        return BaseForm.extend({
            template: _.template(template),
            templateModal: _.template(templateModal),
            templateInput: _.template(templateInput),
            tagName: 'span',
            className: 'create-button',
            events: {
                'click .create': 'promptCreateView'
            },

            /**
             * {@inheritdoc}
             */
            render: function () {
                if ('view' !== this.getRoot().currentViewType) {
                    this.$el.html('');

                    return this;
                }

                this.$el.html(this.template({
                    label: __('grid.view_selector.create_view')
                }));

                this.$('[data-toggle="tooltip"]').tooltip();

                return this;
            },

            renderModal: function() {
                this.$el.html(this.templateModal({
                    subTitleLabel: __('pim_datagrid.view_selector.view'),
                    titleLabel: __('pim_datagrid.view_selector.create_view_modal.create'),
                    picture: 'illustrations/Views.svg',
                    fields: null
                }));

                this.renderExtensions();

                // return this with setElement
                return this.$el.html();
            },

            /**
             * Prompt the view creation modal.
             */
            promptCreateView: function () {
                this.getRoot().trigger('grid:view-selector:close-selector');

                let modal = new Backbone.BootstrapModal({
                    content: this.renderModal(), // replace to '' with setElement
                    okText: __('pim_enrich.entity.create_popin.labels.save')
                });
                modal.open();
                modal.$el.addClass('modal--fullPage');

                // this active the js but broke the modal and the view-selector
                // this.renderModal();
                //    .setElement(modal.$('.modal-body'))
                //    .renderModal();

                modal.on('ok', this.saveView.bind(this, modal));
                modal.on('cancel', function () {
                    this.render()
                    //this.setElement($('[data-drop-zone="view-selector"]').find('[data-drop-zone="secondary-actions"]'))
                    //    .getRoot().render();
                    modal.remove();
                }.bind(this));

                modal.$('input[name="new-view-label"]').on('input', function (event) {
                    var label = event.target.value;

                    if (!label.length) {
                        $submitButton.addClass('AknButton--disabled');
                    } else {
                        $submitButton.removeClass('AknButton--disabled');
                    }
                });
                modal.$('input[name="new-view-label"]').on('keypress', function (event) {
                    if (13 === (event.keyCode || event.which) && event.target.value.length) {
                        $submitButton.trigger('click');
                    }
                });

            },

            /**
             * Save the current Datagrid view in database and triggers an event to the parent
             * to select it.
             *
             * @param {object} modal
             */
            saveView: function (modal) {
                DatagridViewSaver.save(this.getDatagridViewData(), this.getRoot().gridAlias)
                    .done(function (response) {
                        this.getRoot().trigger('grid:view-selector:view-created', response.id);
                    }.bind(this))
                    .fail(function (response) {
                        _.each(response.responseJSON, function (error) {
                            messenger.notify('error', error);
                        });
                    });
            },

            getDatagridViewData: function()
            {
                var gridState = DatagridState.get(this.getRoot().gridAlias, ['filters', 'columns']);

                return {
                    filters: gridState.filters,
                    columns: gridState.columns,
                    label: this.getExtension('pim-grid-view-create-label').getModelValue()
                };
            }
        });
    }
);
