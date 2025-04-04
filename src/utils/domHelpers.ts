
/**
 * A helper function to safely click on DOM elements by selector
 * @param selector CSS selector for the element to click
 * @returns true if element was found and clicked, false otherwise
 */
export const safeElementClick = (selector: string): boolean => {
  const element = document.querySelector(selector);
  if (element instanceof HTMLElement) {
    element.click();
    return true;
  }
  return false;
};
