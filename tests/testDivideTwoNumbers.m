classdef testDivideTwoNumbers < matlab.unittest.TestCase
    % Unit tests for divideTwoNumbers

    methods (Test)
        function testPositiveNumbers(testCase)
            testCase.verifyEqual(divideTwoNumbers(6, 3), 2);
        end

        function testNegativeNumbers(testCase)
            testCase.verifyEqual(divideTwoNumbers(-6, -3), 2);
        end

        function testZero(testCase)
            testCase.verifyEqual(divideTwoNumbers(0, 5), 0);
        end

        function testFractional(testCase)
            testCase.verifyEqual(divideTwoNumbers(1, 3), 0.333333333333333, 'AbsTol', 1e-10);
        end
    end
end
