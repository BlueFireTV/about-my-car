import * as usersIndex from "../../src/users/users-index";

describe("users-index module", () => {
    it("should export a router instance", () => {
        const router = usersIndex.default || usersIndex;
        expect(router).toBeDefined();
        expect(typeof router.use).toBe("function");
        expect(typeof router.get).toBe("function");
        expect(typeof router.stack).toBe("object");
    });

    it("should have at least one route registered", () => {
        const router = usersIndex.default || usersIndex;
        const routeLayers = router.stack.filter(
            (layer: any) => layer.route && layer.route.path
        );
        expect(routeLayers.length).toBeGreaterThan(0);
    });
});
