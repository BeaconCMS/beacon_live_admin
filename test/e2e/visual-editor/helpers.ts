
import { expect, type Page as PlayWrightPage } from '@playwright/test';

export async function startDragging(page: PlayWrightPage) {
    const dragButton = page.getByTestId('drag-button');

    await dragButton.waitFor();
    await dragButton.hover(); // move mouse to drag button
    await page.mouse.down();

    // Note: wait for the clones to be rendered, otherwise it will get a timeout on looking for the
    // test-id specific clones
    await page.locator('[data-is-clone="true"]').first().waitFor();
}

export async function dragTo(
    page: PlayWrightPage,
    targetTestId: string,
    getTargetX: (x: number, width: number) => number = (x, width) => x + width / 2,
    getTargetY: (y: number, height: number) => number = (y, height) => y + height / 2
) {
    // Dragging
    const targetClone = page.getByTestId(targetTestId).and(page.locator('[data-is-clone="true"]'));
    const cloneBox = await targetClone.boundingBox();
    expect(cloneBox).not.toBeNull();
    cloneBox && await page.mouse.move(getTargetX(cloneBox.x, cloneBox.width), getTargetY(cloneBox.y, cloneBox.height));
}

export async function verifyOrder(page: PlayWrightPage, childrenSelector: string, childrenTestIds: Array<string>) {
    await Promise.all(childrenTestIds.map((testId, index)  => {
        return expect(page.locator(childrenSelector).nth(index)).toHaveAttribute('data-test-id', testId);
    }));
}