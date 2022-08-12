Feature: restaurants
  Scenario: default pagination
    When I execute restaurants without pagination arguments
    Then I should get exactly 10 restaurants
    And I should get the page 1 of restaurants

  Scenario: pagination arguments
    When I execute restaurants with page size = 5 and page = 2
    Then I should get exactly 5 restaurants
    And I should get the page 2 of restaurants

  Scenario: hasImage is true
    When I execute restaurants with hasImage = "true"
    Then I should get only restaurants with image links
    Then I should get exactly 3 restaurants

  Scenario: hasImage is false
    When I execute restaurants with hasImage = "false"
    Then I should get only restaurants without image links
    Then I should get exactly 10 restaurants

  Scenario: name is given
    When I execute restaurants with name = "5 Min Cafe"
    Then I should get exactly 1 restaurant
    And I should get only restaurants with name "5 Min Cafe"

  Scenario: only french restaurants allow the review
    When I execute restaurants with page size = 100
    Then I should get only french restaurants with allowReviews as true