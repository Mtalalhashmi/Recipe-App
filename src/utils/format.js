// src/utils/format.js
export function parseIngredients(recipe) {
  return recipe?.extendedIngredients
    ?.map((i) => i?.original?.trim())
    ?.filter(Boolean) || [];
}

export function parseSteps(recipe) {
  const sets = recipe?.analyzedInstructions || [];
  const steps = [];
  sets.forEach((s) => (s.steps || []).forEach((st) => steps.push(st.step)));
  return steps;
}

export function stripHtml(html) {
  return html
    ? html
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .trim()
    : '';
}

export function getRecipeTitle(item) {
  return item?.title || item?.strMeal || 'Untitled';
}

export function getRecipeImage(item) {
  return item?.image || item?.strMealThumb || null;
}

export function getPrimaryTag(item) {
  return (item?.dishTypes && item.dishTypes[0]) ||
    (item?.diets && item.diets[0]) ||
    (item?.cuisines && item.cuisines[0]) ||
    '';
}

export function getCalories(recipe) {
  const cal = recipe?.nutrition?.nutrients?.find((n) => n.name === 'Calories');
  return cal?.amount ? Math.round(cal.amount) : null;
}

export const formatMinutes = (m) => (m ? `${m} min` : '');