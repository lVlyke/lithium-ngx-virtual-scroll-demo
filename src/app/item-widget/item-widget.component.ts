import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  standalone: true,
  selector: 'app-item-widget',
  templateUrl: './item-widget.component.html',
  styleUrls: ['./item-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    "[attr.spinning]": "spinning || null"
  }
})
export class ItemWidgetComponent {

  public readonly baseHref = environment.production ? location.pathname : '';

  @Input()
  public spinning = true;
}
