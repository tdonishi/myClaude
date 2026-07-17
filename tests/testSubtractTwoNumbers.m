classdef testSubtractTwoNumbers < matlab.unittest.TestCase
    % Unit tests for subtractTwoNumbers

    methods (Test)
        function testPositiveNumbers(testCase)
            testCase.verifyEqual(subtractTwoNumbers(5, 3), 2);
        end

        function testNegativeNumbers(testCase)
            testCase.verifyEqual(subtractTwoNumbers(-2, -3), 1);
        end

        function testZero(testCase)
            testCase.verifyEqual(subtractTwoNumbers(0, 0), 0);
        end

        function testFractional(testCase)
            testCase.verifyEqual(subtractTwoNumbers(3.75, 1.5), 2.25, 'AbsTol', 1e-10);
        end
    end
end
