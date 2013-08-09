<?php

namespace Pim\Bundle\ImportExportBundle\Tests\Unit\Reader;

use Pim\Bundle\ImportExportBundle\Reader\CsvReader;

/**
 * Test related class
 *
 * @author    Gildas Quemener <gildas.quemener@gmail.com>
 * @copyright 2013 Akeneo SAS (http://www.akeneo.com)
 * @license   http://opensource.org/licenses/osl-3.0.php  Open Software License (OSL 3.0)
 */
class CsvReaderTest extends \PHPUnit_Framework_TestCase
{
    protected function setUp()
    {
        $this->reader = new CsvReader;
    }

    public function testDefaultValues()
    {
        $this->assertEquals(null, $this->reader->getFilePath());
        $this->assertEquals(0, $this->reader->getLineLength());
        $this->assertEquals(';', $this->reader->getDelimiter());
        $this->assertEquals('"', $this->reader->getEnclosure());
        $this->assertEquals('\\', $this->reader->getEscape());
    }

    public function testRead()
    {
        $this->reader->setFilePath(__DIR__ . '/../../fixtures/import.csv');

        $this->assertEquals(array('firstname', 'lastname', 'age'), $this->reader->read());
        $this->assertEquals(array('Severin', 'Gero', '28'), $this->reader->read());
        $this->assertEquals(array('Kyrylo', 'Zdislav', '34'), $this->reader->read());
        $this->assertEquals(array('Cenek', 'Wojtek', '7'), $this->reader->read());
        $this->assertNull($this->reader->read());
    }

    /**
     * @expectedException        Exception
     * @expectedExceptionMessage Expecting to have 3 columns, actually have 4.
     */
    public function testInvalidCsvRead()
    {
        $this->reader->setFilePath(__DIR__ . '/../../fixtures/invalid_import.csv');

        $this->reader->read();
        $this->reader->read();
    }
}
