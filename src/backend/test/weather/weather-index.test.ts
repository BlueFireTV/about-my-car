import * as weatherIndex from "../../src/weather/weather-index";

describe("weather-index module", () => {
    it("should export a router instance", () => {
        const router = weatherIndex.default || weatherIndex;
        // Check for typical express router properties
        expect(router).toBeDefined();
        expect(typeof router.use).toBe("function");
        expect(typeof router.get).toBe("function");
        expect(typeof router.stack).toBe("object");
    });

    it("should have at least one route registered", () => {
        const router = weatherIndex.default || weatherIndex;
        // Express routers have a stack array with route layers
        const routeLayers = router.stack.filter(
            (layer: any) => layer.route && layer.route.path
        );
        expect(routeLayers.length).toBeGreaterThan(0);
    });
});
