import { isInside, isWithinThreshold } from './util';
import { ValidateDragParams } from 'angular-draggable-droppable';

export class CalendarDragHelper {
  private readonly startPosition: ClientRect;

  constructor(
    private dragContainerElement: HTMLElement,
    draggableElement: HTMLElement
  ) {
    this.startPosition = draggableElement.getBoundingClientRect();
  }

  validateDrag({
    x,
    y,
    dragAlreadyMoved,
    transform
  }: {
    x: number;
    y: number;
    dragAlreadyMoved: boolean;
    transform: ValidateDragParams['transform'];
  }): boolean {
      const newRect: ClientRect = Object.assign({}, this.startPosition, {
        left: this.startPosition.left + transform.x,
        right: this.startPosition.right + transform.x,
        top: this.startPosition.top + transform.y,
        bottom: this.startPosition.bottom + transform.y
      });

      return (
        (isWithinThreshold({ x, y }) || dragAlreadyMoved) &&
        isInside(this.dragContainerElement.getBoundingClientRect(), newRect)
      );
  }
}
