<?php

namespace Pim\Behat\Decorator\Completeness;

use Context\Spin\SpinCapableTrait;
use Pim\Behat\Decorator\ElementDecorator;

/**
 * This class contains methods to find specific completeness blocks from the completeness dropdown
 * in the product edit form.
 *
 * @author    Adrien Petremann <adrien.petremann@akeneo.com>
 * @copyright 2017 Akeneo SAS (http://www.akeneo.com)
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
class DropdownDecorator extends ElementDecorator
{
    use SpinCapableTrait;

    /** @var array Selectors to ease find */
    protected $selectors = [
        'Header stats' => ['css' => '.AknCompletenessPanel-headerStats'],
        'Channel completeness' => ['css', '.AknCompletenessPanel-channel']
    ];

    /**
     * Return Completeness Panel as an array
     * [
     *      [
     *          'position' => 1,
     *          'data'     => [
     *              'ratio' => '90%',
     *              'state' => 'warning',
     *              'label' => 'German (Germany)'
     *              'missing_required_attributes' => ['Model name', 'Collection']
     *          ]
     *      ], ...
     * ]
     *
     * @return array
     */
    public function getCompletenessData()
    {
        $completenesses = [];

        $channelCompletenesses = $this->findAll('css', $this->selectors['Channel completeness']['css']);

        foreach ($channelCompletenesses as $position => $channelCompleteness) {
            $completeness = [
                'position' => $position + 1,
                'label' => $channelCompleteness->find('css', '.AknCompletenessPanel-channelTitle')->getText(),
                'data' => [],
                'missing_required_attributes' => [],
            ];

            $missingAttributes = $channelCompleteness->findAll('css', '.missing-attribute');
            foreach($missingAttributes as $missingAttribute) {
                $completeness['missing_required_attributes'][] = $missingAttribute->getText();
            }

            $completenesses[] = $completeness;
        }
    }
}
