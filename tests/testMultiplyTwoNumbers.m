classdef testMultiplyTwoNumbers < matlab.unittest.TestCase
    % Unit tests for multiplyTwoNumbers

    methods (Test)
        function testPositiveNumbers(testCase)
            testCase.verifyEqual(multiplyTwoNumbers(2, 3), 6);
        end

        function testNegativeNumbers(testCase)
            testCase.verifyEqual(multiplyTwoNumbers(-2, -3), 6);
        end

        function testZero(testCase)
            testCase.verifyEqual(multiplyTwoNumbers(0, 5), 0);
        end

        function testFractional(testCase)
            testCase.verifyEqual(multiplyTwoNumbers(1.5, 2.25), 3.375, 'AbsTol', 1e-10);
        end
    end
end
