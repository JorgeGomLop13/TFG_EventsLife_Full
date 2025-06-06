import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ChildrenOutletContexts, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ConfirmDialogService } from '@common/confirm-dialog/confirm-dialog.service';
import { GlobalMessageService } from '@common/global-message/global-message.service';
import { ProgressSpinnerService } from '@common/progress-spinner/progress-spinner.service';
import { LocaleService } from '@core/locale/locale.service';
import { TranslateModule } from '@ngx-translate/core';
import { slideInAnimation } from './animations';
import { ThemeService } from './core/theme/theme.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, TranslateModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  animations: [slideInAnimation]
})
export class AppComponent {
  private locale: LocaleService = inject(LocaleService);
  //TEST: progress-spinner, confirm-dialog and global-message
  private confirmDialogService: ConfirmDialogService = inject(ConfirmDialogService);
  private globalMessageService: GlobalMessageService = inject(GlobalMessageService);
  private progressSpinnerService: ProgressSpinnerService = inject(ProgressSpinnerService);
  //TEST: theme-service
  protected themeService: ThemeService = inject(ThemeService);

  constructor(private contexts: ChildrenOutletContexts, private router: Router) {
    this.locale.setupAppLanguage();
    //Con esto cada vez que se cambia de ruta se sube la barra de navegación al inicio de la página
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo({ top: 0 });
      }
    });
  }

  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }

  /**
   * TODO: DELETE THIS METHOD
   * Test common services
   */
  testCommonServices() {
    //TEST: progress-spinner, confirm-dialog and global-message
    this.confirmDialogService
      .open({
        title: 'Prueba de confirmación',
        message: 'Pulsa aceptar o cancelar'
      })
      .subscribe((result: boolean) => {
        const spinner = this.progressSpinnerService.show();
        setTimeout(() => {
          this.progressSpinnerService.hide(spinner);
          if (result) {
            this.globalMessageService.showSuccess({ message: 'Has pulsado aceptar', actionText: 'Ok' });
          } else {
            this.globalMessageService.showError({ message: 'Has pulsado cancelar', actionText: 'Close' });
          }
        }, 3000);
      });
  }
}
