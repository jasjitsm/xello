import { Directive, Input, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[tooltip]'
})
export class TooltipDirective {

  @Input() public tooltipText: string;
  @Input() public tooltipPlacement: string;
  @Input() public tooltipDelay: string;

  tooltipRef: HTMLElement;
  offset = 10;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  /**
   * This function creeates a tooltip if it doesn't exist for a particular instance of the Directive.
   * If a tooltip element does exist, it simply makes it visible.
   */
  private showTooltip() {
    if (!this.tooltipRef) {
      this.createTooltip();
      this.setTooltipPosition();
    }
    this.renderer.addClass(this.tooltipRef, 'tooltip--show');
  }

  /**
   * This function creates a tooltip Node, uses Input bound vaules to set its style attributes, and appends
   * it to the DOM.
   */
  private createTooltip() {
    this.tooltipRef = this.renderer.createElement('span');

    this.renderer.appendChild(this.tooltipRef, this.renderer.createText(this.tooltipText));
    this.renderer.appendChild(document.body, this.tooltipRef);

    this.renderer.addClass(this.tooltipRef, 'tooltip');
    this.renderer.addClass(this.tooltipRef, `tooltip--${this.tooltipPlacement}`);
    this.renderer.setStyle(this.tooltipRef, 'transition', `opacity ${this.tooltipDelay}ms`);
  }

  /**
   * This function sets the position of the tooltip based on the element invoking the directive, and window
   * parameters like vertical scroll location.
   */
  private setTooltipPosition() {
    const buttonPos = this.elementRef.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltipRef.getBoundingClientRect();

    const scrollPos = window.pageYOffset;

    let top = 0;
    let left = 0;

    switch (this.tooltipPlacement) {
      case 'top':
        top = buttonPos.top - tooltipPos.height - this.offset;
        left = buttonPos.left + (buttonPos.width - tooltipPos.width) / 2;
        break;
      case 'bottom':
        top = buttonPos.bottom + this.offset;
        left = buttonPos.left + (buttonPos.width - tooltipPos.width) / 2;
        break;
    }

    this.renderer.setStyle(this.tooltipRef, 'top', `${top + scrollPos}px`);
    this.renderer.setStyle(this.tooltipRef, 'left', `${left}px`);
  }

  /**
   * This function removes the tooltip element from the DOM and resets the tooltip reference variables for
   * this instance of the directive.
   */
  private destroyTooltip() {
    if (this.tooltipRef) {
      this.renderer.removeChild(document.body, this.tooltipRef);
      this.tooltipRef = null;
    }
  }

  /**
   * This function listens for a click on the element which triggers the tooltip, and calls the function to
   * craete and show a tooltip.
   */
  @HostListener('click')
  private onMouseClickButton(): void {
    this.showTooltip();
  }

  /**
   * This function listens for a click outside the tooltip trigger element and then hides/destroys the tooltip.
   * @param targetElement Element on which thee click event was fired.
   */
  @HostListener('document:click', ['$event.target'])
  private onMouseClickOutside(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside && targetElement !== this.tooltipRef && this.tooltipRef) {
      this.destroyTooltip();
    }
  }

  /**
   * This function listens for a keydown event on the Escape key and then destroys any visible tooltips.
   * @param event Keypress event
   */
  @HostListener('document:keydown.escape', ['$event'])
  private onEscKeyPressed($event: KeyboardEvent) {
    if (this.tooltipRef) {
      this.destroyTooltip();
    }
  }

  /**
   * This functions changes the placement of the tooltip from top to bottom in case it touches the edge of
   * the viewport.
   * @param $event Window scroll event
   */
  @HostListener('window:scroll', ['$event'])
  private onWindowScroll($event) {
    if (this.tooltipRef) {
      const tooltipPos = this.tooltipRef.getBoundingClientRect();
      const scrollPos = window.pageYOffset;

      if (scrollPos + tooltipPos.top < scrollPos) {
        const tempPlacement = this.tooltipPlacement;
        this.destroyTooltip();
        this.tooltipPlacement = 'bottom';
        this.showTooltip();
        this.tooltipPlacement = tempPlacement;
      }

    }
  }

}
