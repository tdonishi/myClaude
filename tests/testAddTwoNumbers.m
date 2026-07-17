classdef testAddTwoNumbers < matlab.unittest.TestCase
    % Unit tests for addTwoNumbers

    methods (Test)
        function testPositiveNumbers(testCase)
            testCase.verifyEqual(addTwoNumbers(2, 3), 5);
        end

        function testNegativeNumbers(testCase)
            testCase.verifyEqual(addTwoNumbers(-2, -3), -5);
        end

        function testZero(testCase)
            testCase.verifyEqual(addTwoNumbers(0, 0), 0);
        end

        function testFractional(testCase)
            testCase.verifyEqual(addTwoNumbers(1.5, 2.25), 3.75, 'AbsTol', 1e-10);
        end
    end
end
