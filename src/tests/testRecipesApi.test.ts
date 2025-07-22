import { RecipeStore } from "../store/recipes-store";
import { testRecipe } from "./testFav.test";

const mockFetch = jest.fn();
global.fetch = mockFetch;
mockFetch.mockReturnValue(
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(testRecipe),
    headers: new Headers(),
    redirected: false,
    status: 200,
    statusText: "OK",
    url: "https://example.com",
    type: "basic",
    body: null,
    bodyUsed: false,
  })
);

describe("Recipe store", () => {
  const store = new RecipeStore();

  it("getting recipes", async () => {
    expect(store.recipes).toEqual([]);
    await store.getRecipes();
    expect(store.recipes.length).toBe(2);
    expect(store.filterRecipes.length).toBe(2);
    expect(store.recipes[0]).toEqual(testRecipe[0]);
    expect(store.recipes[1]).toEqual(testRecipe[1]);
    store.recipes = [];
  });

  it("filter recipes", async () => {
    await store.getRecipes();
    expect(store.filterRecipes.length).toBe(2);

    store.getFilterRecipes({
      cooktime: "",
      cuisine: "not_selected",
      difficulty: "not_selected",
      caloriesPerServing: "not_selected",
    });
    expect(store.filterRecipes.length).toBe(2);
    expect(store.filterRecipes).toEqual(store.recipes);
    store.getFilterRecipes({
      cooktime: "",
      cuisine: "not_selected",
      difficulty: "medium",
      caloriesPerServing: "not_selected",
    });
    expect(store.filterRecipes.length).toBe(1);
    expect(store.filterRecipes[0].difficulty).toBe("Medium");
    store.getFilterRecipes({
      cooktime: "",
      cuisine: "indian",
      difficulty: "not_selected",
      caloriesPerServing: "not_selected",
    });
    expect(store.filterRecipes.length).toBe(1);
    expect(store.filterRecipes[0].cuisine).toBe("Indian");
  });

  it("change recipes", () => {
    expect(store.filterRecipes).not.toEqual(store.recipes);
    store.changeRecipes();
    expect(store.filterRecipes).toEqual(store.recipes);
  });
});
