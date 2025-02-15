import _ from 'lodash';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoPush, ComponentState, ComponentStateRef } from '@lithiumjs/angular';
import { NgxVirtualScrollModule, VirtualScroll } from '@lithiumjs/ngx-virtual-scroll';
import { combineLatest, delay, filter, merge, switchMap, take } from 'rxjs';
import { ItemWidgetComponent } from './item-widget/item-widget.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        CommonModule,
        FormsModule,
        NgxVirtualScrollModule,
        ItemWidgetComponent
    ],
    providers: [
        ComponentState.create(AppComponent)
    ]
})
export class AppComponent {
  public readonly MAX_SCROLL_HEIGHT_PX = 33554400;

  public virtualScrollEnabled = true;
  public allowSimpleScroll = false;
  public gridList = true;
  public asyncRendering = true;
  public viewCacheLength = 1024;
  public scrollDebounceMs = 50;
  public bufferLength = 1;
  public listItems: number[] = [];
  public scrollHeightWarning = false;
  public widgetCount = 3;
  public spinningWidgets = false;

  @ViewChild(NgForm)
  public form!: NgForm;

  @ViewChild(VirtualScroll)
  public virtualScroll?: VirtualScroll<number>;

  constructor(cdRef: ChangeDetectorRef, stateRef: ComponentStateRef<AppComponent>) {
    AutoPush.enable(this, cdRef);

    this.updateListItems(100000);

    // Only render 100 items when virtual scroll is disabled
    stateRef.get("virtualScrollEnabled").pipe(
      filter(enabled => !enabled && this.listItems.length > 100)
    ).subscribe(() => {
      this.updateListItems(100);
      alert("Item count reduced to 100.");
    });

    // Show a warning when enabling non-virtual scroll
    stateRef.get("allowSimpleScroll").pipe(
      filter(enabled => enabled),
      take(1)
    ).subscribe(() => alert("Warning: Disabling virtual scroll with very large lists can cause browser performance issues."));

    // Disable spinning widgets when more than 10 are rendered
    stateRef.get("widgetCount").pipe(
      filter(count => count > 10)
    ).subscribe(() => this.spinningWidgets = false);

    // Check if the scroll container exceeds browser's maximum scroll height
    combineLatest(stateRef.getAll("form", "virtualScroll")).pipe(
      filter(([form, virtualScroll]) => !!form && !!virtualScroll),
      switchMap(([form, virtualScroll]) => merge(form.valueChanges!, virtualScroll!.renderedItemsChange$)),
      delay(100)
    ).subscribe(() => {
      if (this.virtualScroll?.scrollContainer && this.virtualScroll!.scrollContainer.scrollHeight >= this.MAX_SCROLL_HEIGHT_PX) {
        this.scrollHeightWarning = true;
      } else {
        this.scrollHeightWarning = false;
      }
    });
  }

  public get widgetTimes(): number[] {
    return _.times(this.widgetCount);
  }

  public updateListItems(count: number): void {
    this.listItems = _.times(count);
  }
}
