Feature: restaurants
  Scenario: hasImage is true
    When I execute restaurants with hasImage = true
    Then I should get only restaurants with image links

  Scenario: name is given
    When I execute restaurants with name = "5 Min Cafe"
    Then I should get only one restaurant
    And I should get only restaurants with name "5 Min Cafe"

  Scenario: only french restaurants allow the review
    When I execute restaurants with page size = 100
    Then I should get only french restaurants with allowReviews as true

  Scenario: default pagination
    When I execute restaurants without pagination arguments
    Then I should get 10 restaurants
    And I should get the first page of restaurants

  Scenario: pagination arguments
    When I execute restaurants with page size = 5 and page = 2
    Then I should get 5 restaurants
    And I should get the second page of restaurants