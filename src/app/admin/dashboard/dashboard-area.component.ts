import {Component} from "@angular/core";
import {AdminPendingService} from "app/admin/services";
import { UserMenuService } from 'app/shared/components/user-menu';

@Component({
  selector: 'dashboard-area',
  templateUrl: 'dashboard-area.html',
  styleUrls: ['dashboard-area.scss']
})

export class DashboardAreaComponent {

  public constructor(public pendingService: AdminPendingService,
                     public userMenu: UserMenuService) {}
}
