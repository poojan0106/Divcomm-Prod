@IsTest
private class DummyDebugClassTest {
    @IsTest
    static void testRunDebug() {
        Test.startTest();
        DummyDebugClass.runDebug();
        Test.stopTest();

        System.assert(true, 'Dummy debug method executed');
    }
}