import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'app-item-widget',
  templateUrl: './item-widget.component.html',
  styleUrls: ['./item-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.spinning]": "spinning || null"
  }
})
export class ItemWidgetComponent {

  @Input()
  public spinning = true;
}
