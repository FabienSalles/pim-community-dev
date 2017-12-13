@javascript
Feature: Display a completeness dropdown on products
  In order to quickly have information about product completeness
  As a product manager
  I need to be able to display a dropdown of the current product on the PEF

  Background:
    Given the "catalog_modeling" catalog configuration
    And I am logged in as "Julia"

  Scenario: The dropdown displays completeness information for the product
    Given I am on the "1111111171" product page
    Then I should see the text "Complete: 60%"
    When I open the completeness dropdown
#    And I should see the completeness:
#      | channel   | locale | state   | missing_values | ratio |
#      | ecommerce | de_DE  | warning | 3              | 40%   |
#      | ecommerce | en_US  | warning | 2              | 60%   |
#      | ecommerce | fr_FR  | warning | 3              | 40%   |
    And I should see the completeness in the dropdown:
      | locale | state   | missing_values | ratio | required_attributes                    |
      | de_DE  | warning | 3              | 40%   | Model name, Variation Name, Collection |
      | en_US  | warning | 2              | 60%   | Variation Name, Collection             |
      | fr_FR  | warning | 3              | 40%   | Model name, Variation Name, Collection |

  Scenario: The dropdown displays completeness information for the variant product
  Scenario: I can click on missing required attributes to focus them
  Scenario: If a missing required attribute is on an parent entity, I'm redirected to this entity
