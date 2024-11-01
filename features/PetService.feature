Feature: Pet Profile

  Scenario: Retrieve a pet profile
    Given I have a pet profile
    When I request the pet profile
    Then I should receive the pet profile